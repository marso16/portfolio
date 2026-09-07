import { component$ } from "@builder.io/qwik";
import type { Project } from "./data";

export const Projects = component$<{ entries: Project[] }>(({ entries }) => {
  return (
    <section class="border-t border-border-line bg-surface/40">
      <div class="mx-auto max-w-5xl scroll-mt-24 px-6 py-14" id="projects">
        <p class="font-mono text-sm text-amber">$ ls ~/projects</p>
        <ul class="mt-8 divide-y divide-border-line border-t border-b border-border-line">
          {entries.map((project) => (
            <li key={project.name}>
              <div class="-mx-4 rounded-sm px-4 py-5 transition-colors hover:bg-ink/5">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <a
                    href={project.link}
                    class="font-mono text-base text-ink hover:text-cyan"
                  >
                    {project.name}
                  </a>
                  <a
                    href={project.link}
                    aria-label={`Open ${project.name}`}
                    class="-m-3 p-3 text-ink-muted hover:text-ink"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <path d="M15 3h6v6" />
                      <path d="M10 14 21 3" />
                    </svg>
                  </a>
                </div>
                <p class="mt-2 max-w-xl text-ink-muted">
                  {project.description}
                </p>
                <p class="mt-2 max-w-xl text-sm text-ink-muted">
                  <span class="font-mono text-cyan">impact: </span>
                  {project.impact}
                </p>
                <div class="mt-3 flex flex-wrap items-center gap-4">
                  <span class="flex items-center gap-1.5 text-xs text-ink-muted">
                    <span
                      class="h-2 w-2 rounded-full"
                      style={{ backgroundColor: project.languageColor }}
                    />
                    {project.language}
                  </span>
                  {project.tags.map((tag) => (
                    <span key={tag} class="font-mono text-xs text-ink-muted">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
});
