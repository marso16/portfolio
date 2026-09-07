import { component$, useSignal } from "@builder.io/qwik";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export const Nav = component$<{ resumeUrl: string }>(({ resumeUrl }) => {
  const menuOpen = useSignal(false);

  return (
    <header class="border-border-line bg-void/90 sticky top-0 z-40 border-b backdrop-blur-sm">
      <nav class="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <a
          href="#top"
          onClick$={() => (menuOpen.value = false)}
          class="font-mono text-sm text-ink-muted transition-colors hover:text-cyan"
        >
          marcelino@dev<span class="text-amber">:~$</span>
          <span class="caret text-amber">_</span>
        </a>
        <ul class="hidden items-center gap-6 text-sm sm:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                class="text-ink-muted transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="text-amber underline decoration-amber/40 underline-offset-4 hover:decoration-amber"
            >
              Resume
            </a>
          </li>
        </ul>
        <button
          type="button"
          aria-expanded={menuOpen.value}
          aria-controls="mobile-nav"
          onClick$={() => (menuOpen.value = !menuOpen.value)}
          class="-mr-3 p-3 text-ink-muted hover:text-ink sm:hidden"
        >
          <span class="sr-only">
            {menuOpen.value ? "Close menu" : "Open menu"}
          </span>
          {menuOpen.value ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <path d="M6 6l12 12" />
              <path d="M18 6 6 18" />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            >
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </svg>
          )}
        </button>
      </nav>
      <div
        id="mobile-nav"
        class={`disclosure grid sm:hidden ${menuOpen.value ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <ul class="overflow-y-hidden border-t border-border-line px-6">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick$={() => (menuOpen.value = false)}
                class="block py-3.5 text-sm text-ink-muted transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              class="block py-3.5 text-sm text-amber hover:text-ink"
            >
              Resume
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
});
