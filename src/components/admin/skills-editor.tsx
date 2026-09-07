import { $, component$, useComputed$, useSignal } from "@builder.io/qwik";
import { Form, type ActionStore } from "@builder.io/qwik-city";
import type { SkillGroup } from "~/components/portfolio/data";

interface SkillsEditorProps {
  groups: SkillGroup[];
  action: ActionStore<
    { success: boolean; error?: string } | undefined,
    Record<string, unknown>,
    boolean
  >;
}

export const SkillsEditor = component$<SkillsEditorProps>(
  ({ groups, action }) => {
    const rows = useSignal<SkillGroup[]>(structuredClone(groups));
    const json = useComputed$(() => JSON.stringify(rows.value));

    const updateRow = $((i: number, patch: Partial<SkillGroup>) => {
      rows.value = rows.value.map((row, idx) =>
        idx === i ? { ...row, ...patch } : row,
      );
    });

    return (
      <section class="mt-10 border-t border-border-line pt-6">
        <h2 class="text-lg font-semibold text-ink">Skills</h2>
        <div class="mt-4 flex flex-col gap-4">
          {rows.value.map((group, i) => (
            <div
              key={i}
              class="rounded border border-border-line bg-surface p-4"
            >
              <input
                placeholder="Group key (e.g. languages)"
                value={group.key}
                onInput$={(_, el) => updateRow(i, { key: el.value })}
                class="w-full rounded border border-border-line bg-void px-2 py-1 text-sm text-ink"
              />
              <input
                placeholder="Values (comma separated)"
                value={group.values.join(", ")}
                onInput$={(_, el) =>
                  updateRow(i, {
                    values: el.value
                      .split(",")
                      .map((v) => v.trim())
                      .filter(Boolean),
                  })
                }
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
            rows.value = [...rows.value, { key: "", values: [] }];
          }}
          class="mt-3 text-sm text-cyan hover:text-ink"
        >
          + Add group
        </button>
        <Form action={action} class="mt-4">
          <input type="hidden" name="entries" value={json.value} />
          <button
            type="submit"
            class="rounded bg-amber px-4 py-2 font-semibold text-void hover:bg-amber/90"
          >
            Save skills
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
