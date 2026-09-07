import { component$ } from "@builder.io/qwik";
import {
  Form,
  routeLoader$,
  routeAction$,
  type RequestEventAction,
} from "@builder.io/qwik-city";
import { del, put } from "@vercel/blob";
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
import { ProjectsEditor } from "~/components/admin/projects-editor";
import { SkillsEditor } from "~/components/admin/skills-editor";
import { ResumeUploader } from "~/components/admin/resume-uploader";

export const useAdminContent = routeLoader$(async (event) => {
  await requireAdminSession(event);

  const redis = getRedis(
    event.env.get("UPSTASH_REDIS_REST_URL"),
    event.env.get("UPSTASH_REDIS_REST_TOKEN"),
  );

  const [profile, experience, projects, skills, resumeUrl] = await Promise.all([
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

export const useUpdateProjects = routeAction$(async (form, event) => {
  await requireAdminSession(event);
  let items: Project[];
  try {
    items = JSON.parse(String(form.entries ?? "[]"));
  } catch {
    return { success: false, error: "Invalid project data." };
  }
  if (!Array.isArray(items)) {
    return { success: false, error: "Invalid project data." };
  }
  await writeContent(getRedisFromEvent(event), CONTENT_KEYS.projects, items);
  return { success: true };
});

export const useUpdateSkills = routeAction$(async (form, event) => {
  await requireAdminSession(event);
  let groups: SkillGroup[];
  try {
    groups = JSON.parse(String(form.entries ?? "[]"));
  } catch {
    return { success: false, error: "Invalid skills data." };
  }
  if (!Array.isArray(groups)) {
    return { success: false, error: "Invalid skills data." };
  }
  await writeContent(getRedisFromEvent(event), CONTENT_KEYS.skills, groups);
  return { success: true };
});

export const useLogout = routeAction$(async (_form, event) => {
  event.cookie.delete(COOKIE_NAME, { path: "/" });
  throw event.redirect(302, "/admin/login");
});

export const useUploadResume = routeAction$(async (_form, event) => {
  await requireAdminSession(event);

  const formData = await event.request.formData();
  const file = formData.get("resume");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "No file provided." };
  }
  if (file.type !== "application/pdf") {
    return { success: false, error: "Only PDF files are allowed." };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { success: false, error: "File must be under 10MB." };
  }

  const redis = getRedisFromEvent(event);
  const previousUrl = await readContent<string>(
    redis,
    CONTENT_KEYS.resumeUrl,
    "",
  );

  const blob = await put(`resume-${Date.now()}.pdf`, file, {
    access: "public",
  });
  await writeContent(redis, CONTENT_KEYS.resumeUrl, blob.url);

  if (previousUrl.includes("blob.vercel-storage.com")) {
    await del(previousUrl).catch(() => {});
  }

  return { success: true, url: blob.url };
});

export default component$(() => {
  const content = useAdminContent();
  const logout = useLogout();
  const updateProfile = useUpdateProfile();
  const updateExperience = useUpdateExperience();
  const updateProjects = useUpdateProjects();
  const updateSkills = useUpdateSkills();
  const uploadResume = useUploadResume();

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
      <ProjectsEditor
        entries={content.value.projects}
        action={updateProjects}
      />
      <SkillsEditor groups={content.value.skills} action={updateSkills} />
      <ResumeUploader
        currentUrl={content.value.resumeUrl}
        action={uploadResume}
      />
    </div>
  );
});
