import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
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

export const head: DocumentHead = {
  title: "Marcelino Keyrouz | Software Engineer & AI Engineer",
  meta: [
    {
      name: "description",
      content:
        "Portfolio of Marcelino Keyrouz, a software engineer and AI engineer building production systems and model pipelines.",
    },
  ],
};
