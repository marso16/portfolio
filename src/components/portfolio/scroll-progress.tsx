import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

export const ScrollProgress = component$(() => {
  const progress = useSignal(0);

  // Reflects real scroll position, not decorative — a status readout, so it
  // runs regardless of prefers-reduced-motion.
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - doc.clientHeight;
      progress.value = scrollable > 0 ? (doc.scrollTop / scrollable) * 100 : 0;
    };
    onScroll();
    document.addEventListener("scroll", onScroll, { passive: true });
    cleanup(() => document.removeEventListener("scroll", onScroll));
  });

  return (
    <div class="fixed top-0 left-0 z-50 h-[2px] w-full">
      <div
        class="h-full bg-amber transition-[width] duration-150 ease-out"
        style={{ width: `${progress.value}%` }}
      />
    </div>
  );
});
