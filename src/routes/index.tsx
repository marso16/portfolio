import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Analytics } from "~/components/portfolio/analytics";
import { Nav } from "~/components/portfolio/nav";
import { ScrollProgress } from "~/components/portfolio/scroll-progress";
import { Hero } from "~/components/portfolio/hero";
import { About } from "~/components/portfolio/about";
import { Experience } from "~/components/portfolio/experience";
import { Projects } from "~/components/portfolio/projects";
import { Skills } from "~/components/portfolio/skills";
import { Contact } from "~/components/portfolio/contact";

export default component$(() => {
  return (
    <>
      <Analytics />
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
      </main>
      <Contact />
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
