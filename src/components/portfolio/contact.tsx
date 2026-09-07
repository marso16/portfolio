import { $, component$, useSignal } from "@builder.io/qwik";
import type { Profile } from "./data";

export const Contact = component$<{ profile: Profile }>(({ profile }) => {
  const copied = useSignal(false);

  const copyEmail = $(async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 1500);
    } catch {}
  });

  return (
    <footer class="border-t border-border-line bg-surface/40">
      <div class="mx-auto max-w-5xl scroll-mt-24 px-6 py-14" id="contact">
        <p class="font-mono text-sm text-amber">$ open contact.md</p>
        <h2 class="mt-4 text-2xl font-semibold text-ink">Get in touch</h2>
        <p class="mt-3 max-w-md text-ink-muted">
          Reach me at any of these. Email is fastest.
        </p>
        <div class="mt-6 flex flex-col gap-2 text-cyan sm:flex-row sm:items-center sm:gap-8">
          <span class="flex w-fit items-center gap-1">
            <a href={`mailto:${profile.email}`} class="hover:text-ink">
              {profile.email}
            </a>
            <button
              type="button"
              onClick$={copyEmail}
              aria-label={copied.value ? "Email copied" : "Copy email address"}
              class="-m-2 p-2 text-ink-muted hover:text-cyan"
            >
              {copied.value ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="9" y="9" width="12" height="12" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </button>
          </span>
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
