import { component$, useSignal } from "@builder.io/qwik";
import { experience } from "./data";

const VISIBLE_COUNT = 3;

export const Experience = component$(() => {
  const expanded = useSignal(false);
  const hiddenCount = experience.length - VISIBLE_COUNT;

  const renderEntry = (entry: (typeof experience)[number]) => {
    const isOngoing = entry.date.includes("Present");
    const isEducation = entry.type === "education";
    return (
      <li key={entry.hash} class="relative pb-8 pl-8 last:pb-0">
        <span
          class={`absolute top-1.5 -left-[5px] h-2.5 w-2.5 border-2 border-void ${
            isEducation ? "rotate-45" : "rounded-full"
          } ${isOngoing ? "live-pulse bg-amber" : "bg-cyan"}`}
        />
        <div class="-ml-2 rounded-sm p-2 transition-colors hover:bg-ink/5">
          <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-xs text-ink-muted">
            <span class="text-amber">{entry.hash}</span>
            <span>{entry.date}</span>
          </div>
          <h3 class="mt-2 text-lg font-semibold text-ink">{entry.role}</h3>
          <span class="mt-2 inline-block rounded border border-border-line bg-surface px-2 py-0.5 font-mono text-xs text-cyan">
            {entry.company}
          </span>
          <p class="mt-3 max-w-xl text-justify text-ink-muted hyphens-auto">
            {entry.description}
          </p>
        </div>
      </li>
    );
  };

  return (
    <section id="experience" class="mx-auto max-w-5xl scroll-mt-24 px-6 py-14">
      <p class="font-mono text-sm text-amber">$ git log --oneline --stat</p>
      <ol class="mt-8 border-l border-border-line">
        {experience.slice(0, VISIBLE_COUNT).map(renderEntry)}
        {hiddenCount > 0 && (
          <li class="relative">
            <div
              id="experience-earlier"
              class={`disclosure grid ${expanded.value ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <ol class="overflow-y-hidden border-l border-border-line">
                {experience.slice(VISIBLE_COUNT).map(renderEntry)}
              </ol>
            </div>
            <button
              type="button"
              onClick$={() => (expanded.value = !expanded.value)}
              aria-expanded={expanded.value}
              aria-controls="experience-earlier"
              class="mt-2 block py-2 pl-8 font-mono text-sm text-cyan hover:text-ink"
            >
              {expanded.value
                ? "show fewer"
                : `show earlier history (${hiddenCount})`}
            </button>
          </li>
        )}
      </ol>
    </section>
  );
});
