import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { Profile } from "./data";

const SPARK_POINTS =
  "0,52 18,46 36,38 54,29 72,22 90,17 108,13 126,10.5 144,8.5 162,7.2 180,6.4 198,6";

export const Hero = component$<{ profile: Profile }>(({ profile }) => {
  const epoch = useSignal(0);
  const loss = useSignal(4.82);
  const uptimeSeconds = useSignal(0);
  const pathRef = useSignal<SVGPolylineElement>();

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const uptimeInterval = setInterval(() => {
      uptimeSeconds.value += 1;
    }, 1000);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const finalEpoch = 42;
    const finalLoss = 0.147;
    const path = pathRef.value;
    const length = path?.getTotalLength() ?? 0;

    if (reduceMotion) {
      epoch.value = finalEpoch;
      loss.value = finalLoss;
      cleanup(() => clearInterval(uptimeInterval));
      return;
    }

    if (path) {
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
      path.getBoundingClientRect();
      path.style.transition = "stroke-dashoffset 2.4s ease-out";
      path.style.strokeDashoffset = "0";
    }

    const startTime = performance.now();
    const duration = 2400;
    let interval: ReturnType<typeof setInterval> | undefined;

    const step = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      epoch.value = Math.round(eased * finalEpoch);
      loss.value = 4.82 - eased * (4.82 - finalLoss);
      if (t < 1) {
        frame = requestAnimationFrame(step);
      } else {
        interval = setInterval(() => {
          epoch.value += 1;
          loss.value = Math.max(0.08, finalLoss + (Math.random() - 0.5) * 0.01);
        }, 2600);
      }
    };

    let frame = requestAnimationFrame(step);
    cleanup(() => {
      cancelAnimationFrame(frame);
      clearInterval(uptimeInterval);
      if (interval) clearInterval(interval);
    });
  });

  return (
    <section
      id="top"
      class="mx-auto grid max-w-5xl scroll-mt-24 gap-8 px-6 py-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-12 lg:py-20"
    >
      <div>
        <p class="font-mono text-sm text-amber">$ whoami</p>
        <h1 class="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          {profile.name}
        </h1>
        <p class="mt-2 text-xl text-ink-muted">{profile.title}</p>
        <p class="mt-6 max-w-md text-justify text-ink-muted hyphens-auto">
          {profile.bio}
        </p>
        <div class="mt-8 flex items-center gap-6 text-sm">
          <a
            href="#projects"
            class="text-amber underline decoration-amber/40 underline-offset-4 hover:decoration-amber"
          >
            View work
          </a>
          <a
            href="#contact"
            class="text-ink underline decoration-ink-muted/40 underline-offset-4 hover:decoration-ink"
          >
            Get in touch
          </a>
        </div>
      </div>

      <div class="rounded-md border border-border-line bg-surface p-6 font-mono text-sm">
        <div class="flex flex-wrap items-center justify-between gap-2 text-ink-muted">
          <span>training_run.py</span>
          <span class="flex items-center gap-2">
            <span class="live-pulse h-1.5 w-1.5 rounded-full bg-amber" />
            live
          </span>
        </div>
        <dl class="mt-6 grid grid-cols-3 gap-4">
          <div>
            <dt class="text-ink-muted">epoch</dt>
            <dd class="mt-1 text-lg text-ink">{epoch.value}</dd>
          </div>
          <div>
            <dt class="text-ink-muted">loss</dt>
            <dd class="mt-1 text-lg text-cyan">{loss.value.toFixed(3)}</dd>
          </div>
          <div>
            <dt class="text-ink-muted">uptime</dt>
            <dd class="mt-1 text-lg text-ink">
              {Math.floor(uptimeSeconds.value / 60)}:
              {String(uptimeSeconds.value % 60).padStart(2, "0")}
            </dd>
          </div>
        </dl>
        <svg
          viewBox="0 0 200 60"
          class="mt-6 h-16 w-full overflow-visible"
          preserveAspectRatio="none"
        >
          <polyline
            ref={pathRef}
            points={SPARK_POINTS}
            fill="none"
            stroke="#5fd4d0"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </section>
  );
});
