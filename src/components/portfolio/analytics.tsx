import { component$, useVisibleTask$ } from "@builder.io/qwik";

export const Analytics = component$(() => {
  // Vercel Web Analytics has no Qwik-specific entry point; this calls its
  // framework-agnostic inject() once the page is interactive.
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    const { inject } = await import("@vercel/analytics");
    inject();
  });

  return null;
});
