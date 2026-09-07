import { $, component$, useComputed$, useSignal } from "@builder.io/qwik";
import { Form, type ActionStore } from "@builder.io/qwik-city";
import type { ExperienceEntry } from "~/components/portfolio/data";

interface ExperienceEditorProps {
  entries: ExperienceEntry[];
  action: ActionStore<
    { success: boolean; error?: string } | undefined,
    Record<string, unknown>,
    boolean
  >;
}

export const ExperienceEditor = component$<ExperienceEditorProps>(
  ({ entries, action }) => {
    const rows = useSignal<ExperienceEntry[]>(structuredClone(entries));
    const json = useComputed$(() => JSON.stringify(rows.value));

    const updateRow = $((i: number, patch: Partial<ExperienceEntry>) => {
      rows.value = rows.value.map((row, idx) =>
        idx === i ? { ...row, ...patch } : row,
      );
    });

    return (
      <section class="mt-10 border-t border-border-line pt-6">
        <h2 class="text-lg font-semibold text-ink">Experience</h2>
        <div class="mt-4 flex flex-col gap-4">
          {rows.value.map((entry, i) => (
            <div
              key={i}
              class="rounded border border-border-line bg-surface p-4"
            >
              <div class="grid grid-cols-2 gap-2">
                <input
                  placeholder="Date range"
                  value={entry.date}
                  onInput$={(_, el) => updateRow(i, { date: el.value })}
                  class="rounded border border-border-line bg-void px-2 py-1 text-sm text-ink"
                />
                <input
                  placeholder="Role"
                  value={entry.role}
                  onInput$={(_, el) => updateRow(i, { role: el.value })}
                  class="rounded border border-border-line bg-void px-2 py-1 text-sm text-ink"
                />
                <input
                  placeholder="Company"
                  value={entry.company}
                  onInput$={(_, el) => updateRow(i, { company: el.value })}
                  class="rounded border border-border-line bg-void px-2 py-1 text-sm text-ink"
                />
                <input
                  placeholder="Hash"
                  value={entry.hash}
                  onInput$={(_, el) => updateRow(i, { hash: el.value })}
                  class="rounded border border-border-line bg-void px-2 py-1 text-sm text-ink"
                />
              </div>
              <textarea
                placeholder="Description"
                value={entry.description}
                rows={2}
                onInput$={(_, el) => updateRow(i, { description: el.value })}
                class="mt-2 w-full rounded border border-border-line bg-void px-2 py-1 text-sm text-ink"
              />
              <button
                type="button"
                onClick$={() => {
                  rows.value = rows.value.filter((_, idx) => idx !== i);
                }}
                class="mt-2 text-xs text-red-400 hover:text-red-300"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick$={() => {
            rows.value = [
              ...rows.value,
              { hash: "", date: "", role: "", company: "", description: "" },
            ];
          }}
          class="mt-3 text-sm text-cyan hover:text-ink"
        >
          + Add entry
        </button>
        <Form action={action} class="mt-4">
          <input type="hidden" name="entries" value={json.value} />
          <button
            type="submit"
            class="rounded bg-amber px-4 py-2 font-semibold text-void hover:bg-amber/90"
          >
            Save experience
          </button>
          {action.value?.success && (
            <p class="mt-2 text-sm text-cyan">Saved.</p>
          )}
          {action.value?.error && (
            <p class="mt-2 text-sm text-red-400">{action.value.error}</p>
          )}
        </Form>
      </section>
    );
  },
);
