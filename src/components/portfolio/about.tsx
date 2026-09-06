import { component$ } from "@builder.io/qwik";

export const About = component$(() => {
  return (
    <section class="border-t border-border-line bg-surface/40">
      <div class="mx-auto max-w-5xl scroll-mt-24 px-6 py-10" id="about">
        <p class="font-mono text-sm text-amber">$ cat about.md</p>
        <p class="mt-4 max-w-xl text-ink-muted">
          I spend most of my time in the space between traditional software
          engineering and applied AI: designing the services, data pipelines,
          and infrastructure that make model-backed features reliable enough to
          run in production, then iterating on the models and prompts that sit
          on top of them. I care most about systems that are easy to reason
          about, test, and hand off.
        </p>
        <p class="mt-4 max-w-xl text-ink-muted">
          Most of what I build sits at the boundary between two worlds that
          don't always speak the same language: the reliability expectations of
          traditional backend engineering, and the empirical, iterative nature
          of working with models. I like closing that gap: writing evaluation
          harnesses instead of eyeballing outputs, treating prompts and
          pipelines as versioned artifacts, and building the kind of tooling
          that makes an AI feature boring to operate.
        </p>
      </div>
    </section>
  );
});
