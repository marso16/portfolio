import { $, component$, useComputed$, useSignal } from "@builder.io/qwik";
import { Form, type ActionStore } from "@builder.io/qwik-city";
import type { Project } from "~/components/portfolio/data";

interface ProjectsEditorProps {
  entries: Project[];
  action: ActionStore<
    { success: boolean; error?: string } | undefined,
    Record<string, unknown>,
    boolean
  >;
}

export const ProjectsEditor = component$<ProjectsEditorProps>(
  ({ entries, action }) => {
    const rows = useSignal<Project[]>(structuredClone(entries));
    const json = useComputed$(() => JSON.stringify(rows.value));

    const updateRow = $((i: number, patch: Partial<Project>) => {
      rows.value = rows.value.map((row, idx) =>
        idx === i ? { ...row, ...patch } : row,
      );
    });

    return (
      <section class="mt-10 border-t border-border-line pt-6">
        <h2 class="text-lg font-semibold text-ink">Projects</h2>
        <div class="mt-4 flex flex-col gap-4">
          {rows.value.map((project, i) => (
            <div
              key={i}
              class="rounded border border-border-line bg-surface p-4"
            >
              <div class="grid grid-cols-2 gap-2">
                <input
                  placeholder="Name"
                  value={project.name}
                  onInput$={(_, el) => updateRow(i, { name: el.value })}
                  class="rounded border border-border-line bg-void px-2 py-1 text-sm text-ink"
                />
                <input
                  placeholder="Language"
                  value={project.language}
                  onInput$={(_, el) => updateRow(i, { language: el.value })}
                  class="rounded border border-border-line bg-void px-2 py-1 text-sm text-ink"
                />
                <input
                  placeholder="Language color (hex)"
                  value={project.languageColor}
                  onInput$={(_, el) =>
                    updateRow(i, { languageColor: el.value })
                  }
                  class="rounded border border-border-line bg-void px-2 py-1 text-sm text-ink"
                />
                <input
                  placeholder="Link"
                  value={project.link}
                  onInput$={(_, el) => updateRow(i, { link: el.value })}
                  class="rounded border border-border-line bg-void px-2 py-1 text-sm text-ink"
                />
              </div>
              <textarea
                placeholder="Description"
                value={project.description}
                rows={2}
                onInput$={(_, el) =>
                  updateRow(i, { description: el.value })
                }
                class="mt-2 w-full rounded border border-border-line bg-void px-2 py-1 text-sm text-ink"
              />
              <input
                placeholder="Impact"
                value={project.impact}
                onInput$={(_, el) => updateRow(i, { impact: el.value })}
                class="mt-2 w-full rounded border border-border-line bg-void px-2 py-1 text-sm text-ink"
              />
              <input
                placeholder="Tags (comma separated)"
                value={project.tags.join(", ")}
                onInput$={(_, el) =>
                  updateRow(i, {
                    tags: el.value
                      .split(",")
                      .map((t) => t.trim())
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
            rows.value = [
              ...rows.value,
              {
                name: "",
                language: "",
                languageColor: "#e7a445",
                description: "",
                impact: "",
                tags: [],
                link: "",
              },
            ];
          }}
          class="mt-3 text-sm text-cyan hover:text-ink"
        >
          + Add project
        </button>
        <Form action={action} class="mt-4">
          <input type="hidden" name="entries" value={json.value} />
          <button
            type="submit"
            class="rounded bg-amber px-4 py-2 font-semibold text-void hover:bg-amber/90"
          >
            Save projects
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
