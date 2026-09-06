import { component$ } from "@builder.io/qwik";
import { skills } from "./data";

export const Skills = component$(() => {
  return (
    <section id="skills" class="mx-auto max-w-5xl scroll-mt-24 px-6 py-10">
      <p class="font-mono text-sm text-amber">$ cat skills.yaml</p>
      <div class="mt-8 max-w-xl rounded-md border border-border-line bg-surface p-6 font-mono text-sm leading-relaxed">
        {skills.map((group) => (
          <div key={group.key} class="mt-4 first:mt-0">
            <span class="text-cyan">{group.key}</span>
            <span class="text-ink-muted">:</span>
            {group.values.map((value) => (
              <div key={value} class="pl-4 text-ink-muted">
                <span class="text-ink-muted">- </span>
                <span class="text-ink">{value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
});
