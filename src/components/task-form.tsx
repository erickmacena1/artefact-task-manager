"use client";

import { useMutation } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import { createTaskInput, type Task } from "@/lib/tasks";
import { useTRPC } from "@/trpc/client";

type TaskFormProps = {
  /** Present when editing an existing task, absent when creating a new one. */
  task?: Task;
};

export function TaskForm({ task }: TaskFormProps) {
  const trpc = useTRPC();
  const router = useRouter();
  const isEditing = task !== undefined;

  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const createTask = useMutation(trpc.tasks.create.mutationOptions());
  const updateTask = useMutation(trpc.tasks.update.mutationOptions());
  const isPending = createTask.isPending || updateTask.isPending;

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    // Validate with the same schema the router uses, so the browser and the
    // server can never disagree about what a valid task looks like.
    const parsed = createTaskInput.safeParse({ title, description });
    if (!parsed.success) {
      const titleIssue = parsed.error.issues.find(
        (issue) => issue.path[0] === "title",
      );
      if (titleIssue) {
        setTitleError(titleIssue.message);
      } else {
        setFormError(parsed.error.issues[0]?.message ?? "Please check the form.");
      }
      return;
    }
    setTitleError(null);

    try {
      if (task) {
        await updateTask.mutateAsync({ id: task.id, ...parsed.data });
      } else {
        await createTask.mutateAsync(parsed.data);
      }
      // The listing is a dynamic Server Component, so navigating to it makes
      // the router request a fresh render with the updated in-memory data.
      router.push("/");
    } catch (error) {
      setFormError(
        error instanceof TRPCClientError
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (titleError) setTitleError(null);
          }}
          aria-invalid={titleError ? true : undefined}
          aria-describedby={titleError ? "title-error" : undefined}
          placeholder="What needs to be done?"
          className="mt-1 w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/20 dark:border-white/20 dark:focus:border-zinc-400"
        />
        {titleError ? (
          <p
            id="title-error"
            className="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            {titleError}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          Description{" "}
          <span className="font-normal text-zinc-500">(optional)</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
          placeholder="Add any useful details."
          className="mt-1 w-full resize-y rounded-lg border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-500/20 dark:border-white/20 dark:focus:border-zinc-400"
        />
      </div>

      {formError ? (
        <p
          role="alert"
          className="rounded-lg border border-red-600/30 bg-red-600/5 px-3 py-2 text-sm text-red-700 dark:text-red-400"
        >
          {formError}
        </p>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {isPending
            ? isEditing
              ? "Saving…"
              : "Creating…"
            : isEditing
              ? "Save changes"
              : "Create task"}
        </button>
        <Link
          href="/"
          className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 transition hover:bg-black/5 dark:text-zinc-400 dark:hover:bg-white/10"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
