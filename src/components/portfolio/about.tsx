import { component$ } from "@builder.io/qwik";
import { profile } from "./data";

export const About = component$(() => {
  return (
    <section class="border-t border-border-line bg-surface/40">
      <div class="mx-auto max-w-5xl scroll-mt-24 px-6 py-10" id="about">
        <p class="font-mono text-sm text-amber">$ cat about.md</p>
        {profile.aboutParagraphs.map((paragraph, i) => (
          <p
            key={i}
            class="mt-4 max-w-xl text-justify text-ink-muted hyphens-auto"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
});
