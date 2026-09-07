import { component$ } from "@builder.io/qwik";
import { Form, routeLoader$, routeAction$ } from "@builder.io/qwik-city";
import { requireAdminSession } from "~/lib/admin-guard";
import { CONTENT_KEYS, getRedis, readContent } from "~/lib/redis";
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

export const useLogout = routeAction$(async (_form, event) => {
  event.cookie.delete(COOKIE_NAME, { path: "/" });
  throw event.redirect(302, "/admin/login");
});

export default component$(() => {
  const content = useAdminContent();
  const logout = useLogout();

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
      <p class="mt-2 text-sm text-ink-muted">
        Loaded {content.value.experience.length} experience entries,{" "}
        {content.value.projects.length} projects,{" "}
        {content.value.skills.length} skill groups.
      </p>
    </div>
  );
});
