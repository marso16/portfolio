import { component$ } from "@builder.io/qwik";
import {
  Form,
  routeLoader$,
  routeAction$,
  type RequestEventAction,
} from "@builder.io/qwik-city";
import { requireAdminSession } from "~/lib/admin-guard";
import { CONTENT_KEYS, getRedis, readContent, writeContent } from "~/lib/redis";
import { COOKIE_NAME } from "~/lib/session";
import {
  experience as fallbackExperience,
  profile as fallbackProfile,
  projects as fallbackProjects,
  skills as fallbackSkills,
  type ExperienceEntry,
  type Profile,
  type Project,
  type SkillGroup,
} from "~/components/portfolio/data";
import { ProfileForm } from "~/components/admin/profile-form";
import { ExperienceEditor } from "~/components/admin/experience-editor";

export const useAdminContent = routeLoader$(async (event) => {
  await requireAdminSession(event);

  const redis = getRedis(
    event.env.get("UPSTASH_REDIS_REST_URL"),
    event.env.get("UPSTASH_REDIS_REST_TOKEN"),
  );

  const [profile, experience, projects, skills, resumeUrl] =
    await Promise.all([
      readContent<Profile>(redis, CONTENT_KEYS.profile, fallbackProfile),
      readContent<ExperienceEntry[]>(
        redis,
        CONTENT_KEYS.experience,
        fallbackExperience,
      ),
      readContent<Project[]>(redis, CONTENT_KEYS.projects, fallbackProjects),
      readContent<SkillGroup[]>(redis, CONTENT_KEYS.skills, fallbackSkills),
      readContent<string>(redis, CONTENT_KEYS.resumeUrl, "/resume.pdf"),
    ]);

  return { profile, experience, projects, skills, resumeUrl };
});

function getRedisFromEvent(event: RequestEventAction) {
  return getRedis(
    event.env.get("UPSTASH_REDIS_REST_URL"),
    event.env.get("UPSTASH_REDIS_REST_TOKEN"),
  );
}

export const useUpdateProfile = routeAction$(async (form, event) => {
  await requireAdminSession(event);
  const updated: Profile = {
    name: String(form.name ?? ""),
    title: String(form.title ?? ""),
    bio: String(form.bio ?? ""),
    aboutParagraphs: String(form.aboutParagraphs ?? "")
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean),
    email: String(form.email ?? ""),
    github: String(form.github ?? ""),
    linkedin: String(form.linkedin ?? ""),
  };
  await writeContent(getRedisFromEvent(event), CONTENT_KEYS.profile, updated);
  return { success: true };
});

export const useUpdateExperience = routeAction$(async (form, event) => {
  await requireAdminSession(event);
  let entries: ExperienceEntry[];
  try {
    entries = JSON.parse(String(form.entries ?? "[]"));
  } catch {
    return { success: false, error: "Invalid experience data." };
  }
  if (!Array.isArray(entries)) {
    return { success: false, error: "Invalid experience data." };
  }
  await writeContent(
    getRedisFromEvent(event),
    CONTENT_KEYS.experience,
    entries,
  );
  return { success: true };
});

export const useLogout = routeAction$(async (_form, event) => {
  event.cookie.delete(COOKIE_NAME, { path: "/" });
  throw event.redirect(302, "/admin/login");
});

export default component$(() => {
  const content = useAdminContent();
  const logout = useLogout();
  const updateProfile = useUpdateProfile();
  const updateExperience = useUpdateExperience();

  return (
    <div class="mx-auto max-w-3xl px-6 py-12">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-semibold text-ink">Admin</h1>
        <Form action={logout}>
          <button type="submit" class="text-sm text-cyan hover:text-ink">
            Log out
          </button>
        </Form>
      </div>
      <ProfileForm profile={content.value.profile} action={updateProfile} />
      <ExperienceEditor
        entries={content.value.experience}
        action={updateExperience}
      />
    </div>
  );
});
