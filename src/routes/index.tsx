import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { Analytics } from "~/components/portfolio/analytics";
import { Nav } from "~/components/portfolio/nav";
import { ScrollProgress } from "~/components/portfolio/scroll-progress";
import { Hero } from "~/components/portfolio/hero";
import { About } from "~/components/portfolio/about";
import { Experience } from "~/components/portfolio/experience";
import { Projects } from "~/components/portfolio/projects";
import { Skills } from "~/components/portfolio/skills";
import { Contact } from "~/components/portfolio/contact";
import { CONTENT_KEYS, getRedisFromEnv, readAllContent } from "~/lib/redis";
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

export const usePortfolioContent = routeLoader$(async (event) => {
  const redis = getRedisFromEnv(event.env);

  const [profile, experience, projects, skills, resumeUrl] =
    await readAllContent(redis, [
      CONTENT_KEYS.profile,
      CONTENT_KEYS.experience,
      CONTENT_KEYS.projects,
      CONTENT_KEYS.skills,
      CONTENT_KEYS.resumeUrl,
    ]);

  // Let the CDN absorb repeat traffic instead of hitting Redis on every
  // request: serve from cache for up to 60s, and up to a day stale while
  // a fresh copy is fetched in the background.
  event.cacheControl({
    staleWhileRevalidate: 86400,
    maxAge: 60,
  });

  return {
    profile: (profile as Profile | null) ?? EMPTY_PROFILE,
    experience: (experience as ExperienceEntry[] | null) ?? [],
    projects: (projects as Project[] | null) ?? [],
    skills: (skills as SkillGroup[] | null) ?? [],
    resumeUrl: (resumeUrl as string | null) ?? "",
  };
});

export default component$(() => {
  const content = usePortfolioContent();

  return (
    <>
      <Analytics />
      <ScrollProgress />
      <Nav resumeUrl={content.value.resumeUrl} />
      <main>
        <Hero profile={content.value.profile} />
        <About profile={content.value.profile} />
        <Experience entries={content.value.experience} />
        <Projects entries={content.value.projects} />
        <Skills groups={content.value.skills} />
      </main>
      <Contact profile={content.value.profile} />
    </>
  );
});

const title = "Marcelino Keyrouz | Software Engineer & AI Engineer";
const description =
  "Portfolio of Marcelino Keyrouz, a software engineer and AI engineer building production systems and model pipelines.";

export const head: DocumentHead = {
  title,
  meta: [
    { name: "description", content: description },
    { name: "theme-color", content: "#0c1015" },
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: "/og.png" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: "/og.png" },
  ],
};
