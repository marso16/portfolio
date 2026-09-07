import { component$ } from "@builder.io/qwik";
import {
  Form,
  routeLoader$,
  routeAction$,
  type RequestEventAction,
} from "@builder.io/qwik-city";
import { del, put } from "@vercel/blob";
import { requireAdminSession } from "~/lib/admin-guard";
import {
  CONTENT_KEYS,
  getRedis,
  getRedisFromEnv,
  readContent,
  writeContent,
} from "~/lib/redis";
import { COOKIE_NAME } from "~/lib/session";
import {
  type ExperienceEntry,
  type Profile,
  type Project,
  type SkillGroup,
} from "~/components/portfolio/data";

const EMPTY_PROFILE: Profile = {
  name: "",
  title: "",
  bio: "",
  aboutParagraphs: [],
  email: "",
  github: "",
  linkedin: "",
};
import { ProfileForm } from "~/components/admin/profile-form";
import { ExperienceEditor } from "~/components/admin/experience-editor";
import { ProjectsEditor } from "~/components/admin/projects-editor";
import { SkillsEditor } from "~/components/admin/skills-editor";
import { ResumeUploader } from "~/components/admin/resume-uploader";

export const useAdminContent = routeLoader$(async (event) => {
  await requireAdminSession(event);

  const redis = getRedisFromEnv(event.env);

  const [profile, experience, projects, skills, resumeUrl] = await Promise.all([
    readContent<Profile>(redis, CONTENT_KEYS.profile),
    readContent<ExperienceEntry[]>(redis, CONTENT_KEYS.experience),
    readContent<Project[]>(redis, CONTENT_KEYS.projects),
    readContent<SkillGroup[]>(redis, CONTENT_KEYS.skills),
    readContent<string>(redis, CONTENT_KEYS.resumeUrl),
  ]);

  return {
    profile: profile ?? EMPTY_PROFILE,
    experience: experience ?? [],
    projects: projects ?? [],
    skills: skills ?? [],
    resumeUrl: resumeUrl ?? "",
  };
});

function getRedisFromEvent(event: RequestEventAction) {
  return getRedisFromEnv(event.env);
}

/**
 * Wraps `writeContent` so a misconfigured/unreachable Redis (which
 * `writeContent` signals by throwing) turns into the same
 * `{ success: false, error }` shape the editors already know how to
 * render, instead of an uncaught 500.
 */
async function writeContentSafely<T>(
  redis: ReturnType<typeof getRedis>,
  key: string,
  value: T,
  label: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await writeContent(redis, key, value);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : `Failed to save ${label}.`,
    };
  }
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
  return writeContentSafely(
    getRedisFromEvent(event),
    CONTENT_KEYS.profile,
    updated,
    "profile",
  );
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
  return writeContentSafely(
    getRedisFromEvent(event),
    CONTENT_KEYS.experience,
    entries,
    "experience",
  );
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
  return writeContentSafely(
    getRedisFromEvent(event),
    CONTENT_KEYS.projects,
    items,
    "projects",
  );
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
  return writeContentSafely(
    getRedisFromEvent(event),
    CONTENT_KEYS.skills,
    groups,
    "skills",
  );
});

export const useLogout = routeAction$(async (_form, event) => {
  event.cookie.delete(COOKIE_NAME, { path: "/" });
  throw event.redirect(302, "/admin/login");
});

export const useUploadResume = routeAction$(async (form, event) => {
  await requireAdminSession(event);

  // Qwik City already parses the multipart body (`parseBody()`) before
  // invoking this action and hands the result in as `form` — the request
  // body has already been consumed, so calling `event.request.formData()`
  // again here would throw "Body is unusable: Body has already been read".
  // `formToObj` preserves `File` values as-is, so read it straight off `form`.
  const file = form.resume;
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, error: "No file provided." };
  }
  if (file.type !== "application/pdf") {
    return { success: false, error: "Only PDF files are allowed." };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { success: false, error: "File must be under 10MB." };
  }

  const blobToken = event.env.get("BLOB_READ_WRITE_TOKEN");
  if (!blobToken) {
    return { success: false, error: "Blob storage is not configured." };
  }

  const redis = getRedisFromEvent(event);
  const previousUrl =
    (await readContent<string>(redis, CONTENT_KEYS.resumeUrl)) ?? "";

  const blob = await put(`resume-${Date.now()}.pdf`, file, {
    access: "public",
    token: blobToken,
  });
  await writeContent(redis, CONTENT_KEYS.resumeUrl, blob.url);

  if (previousUrl.includes("blob.vercel-storage.com")) {
    await del(previousUrl, { token: blobToken }).catch(() => {});
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
