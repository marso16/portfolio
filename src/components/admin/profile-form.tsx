import { component$ } from "@builder.io/qwik";
import { Form, type ActionStore } from "@builder.io/qwik-city";
import type { Profile } from "~/components/portfolio/data";

interface ProfileFormProps {
  profile: Profile;
  action: ActionStore<
    { success: boolean; error?: string } | undefined,
    Record<string, unknown>,
    boolean
  >;
}

export const ProfileForm = component$<ProfileFormProps>(
  ({ profile, action }) => {
    return (
      <section class="mt-10 border-t border-border-line pt-6">
        <h2 class="text-lg font-semibold text-ink">Profile &amp; about</h2>
        <Form action={action} class="mt-4 flex flex-col gap-3">
          <label class="flex flex-col gap-1 text-sm text-ink-muted">
            Name
            <input
              name="name"
              value={profile.name}
              class="rounded border border-border-line bg-surface px-3 py-2 text-ink"
            />
          </label>
          <label class="flex flex-col gap-1 text-sm text-ink-muted">
            Title
            <input
              name="title"
              value={profile.title}
              class="rounded border border-border-line bg-surface px-3 py-2 text-ink"
            />
          </label>
          <label class="flex flex-col gap-1 text-sm text-ink-muted">
            Hero bio
            <textarea
              name="bio"
              value={profile.bio}
              rows={3}
              class="rounded border border-border-line bg-surface px-3 py-2 text-ink"
            />
          </label>
          <label class="flex flex-col gap-1 text-sm text-ink-muted">
            About paragraphs (leave a blank line between paragraphs)
            <textarea
              name="aboutParagraphs"
              value={profile.aboutParagraphs.join("\n\n")}
              rows={6}
              class="rounded border border-border-line bg-surface px-3 py-2 text-ink"
            />
          </label>
          <label class="flex flex-col gap-1 text-sm text-ink-muted">
            Email
            <input
              name="email"
              value={profile.email}
              class="rounded border border-border-line bg-surface px-3 py-2 text-ink"
            />
          </label>
          <label class="flex flex-col gap-1 text-sm text-ink-muted">
            GitHub URL
            <input
              name="github"
              value={profile.github}
              class="rounded border border-border-line bg-surface px-3 py-2 text-ink"
            />
          </label>
          <label class="flex flex-col gap-1 text-sm text-ink-muted">
            LinkedIn URL
            <input
              name="linkedin"
              value={profile.linkedin}
              class="rounded border border-border-line bg-surface px-3 py-2 text-ink"
            />
          </label>
          <button
            type="submit"
            class="mt-2 w-fit rounded bg-amber px-4 py-2 font-semibold text-void hover:bg-amber/90"
          >
            Save profile
          </button>
          {action.value?.success && (
            <p class="text-sm text-cyan">Saved.</p>
          )}
          {action.value?.error && (
            <p class="text-sm text-red-400">{action.value.error}</p>
          )}
        </Form>
      </section>
    );
  },
);
