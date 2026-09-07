import { component$ } from "@builder.io/qwik";
import { Form, type ActionStore } from "@builder.io/qwik-city";

interface ResumeUploaderProps {
  currentUrl: string;
  action: ActionStore<
    { success: boolean; error?: string; url?: string } | undefined,
    Record<string, unknown>,
    boolean
  >;
}

export const ResumeUploader = component$<ResumeUploaderProps>(
  ({ currentUrl, action }) => {
    return (
      <section class="mt-10 border-t border-border-line pt-6">
        <h2 class="text-lg font-semibold text-ink">Resume</h2>
        <p class="mt-2 text-sm text-ink-muted">
          Current:{" "}
          <a href={currentUrl} class="text-cyan hover:text-ink">
            {currentUrl}
          </a>
        </p>
        <Form
          action={action}
          enctype="multipart/form-data"
          class="mt-4 flex items-center gap-3"
        >
          <input
            type="file"
            name="resume"
            accept="application/pdf"
            required
            class="text-sm text-ink-muted"
          />
          <button
            type="submit"
            class="rounded bg-amber px-4 py-2 font-semibold text-void hover:bg-amber/90"
          >
            Upload
          </button>
        </Form>
        {action.value?.success && (
          <p class="mt-2 text-sm text-cyan">Uploaded.</p>
        )}
        {action.value?.error && (
          <p class="mt-2 text-sm text-red-400">{action.value.error}</p>
        )}
      </section>
    );
  },
);
