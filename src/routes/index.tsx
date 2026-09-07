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
import { CONTENT_KEYS, getRedis, readContent } from "~/lib/redis";
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

export const usePortfolioContent = routeLoader$(async (event) => {
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
