import { component$ } from "@builder.io/qwik";
import { profile } from "./data";

export const Contact = component$(() => {
  return (
    <footer class="border-t border-border-line bg-surface/40">
      <div class="mx-auto max-w-5xl scroll-mt-24 px-6 py-14" id="contact">
        <p class="font-mono text-sm text-amber">$ open contact.md</p>
        <h2 class="mt-4 text-2xl font-semibold text-ink">Get in touch</h2>
        <p class="mt-3 max-w-md text-ink-muted">
          Reach me at any of these. Email is fastest.
        </p>
        <div class="mt-6 flex flex-col gap-2 text-cyan sm:flex-row sm:gap-8">
          <a href={`mailto:${profile.email}`} class="hover:text-ink w-fit">
            {profile.email}
          </a>
          <a href={profile.github} class="hover:text-ink w-fit">
            github.com/marso16
          </a>
          <a href={profile.linkedin} class="hover:text-ink w-fit">
            linkedin
          </a>
        </div>
        <a
          href="#top"
          aria-label="Back to top"
          class="mt-10 inline-block font-mono text-xs text-ink-muted underline decoration-ink-muted/40 underline-offset-4 hover:text-cyan hover:decoration-cyan"
        >
          $ cd ~
        </a>
      </div>
    </footer>
  );
});
