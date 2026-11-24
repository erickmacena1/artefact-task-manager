"use client";

import { useMutation } from "@tanstack/react-query";
import { TRPCClientError } from "@trpc/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/toast";
import { useTRPC } from "@/trpc/client";

type DeleteTaskButtonProps = {
  id: string;
  title: string;
};

/** Deletes one task. Success is confirmed with a toast; errors stay inline. */
export function DeleteTaskButton({ id, title }: DeleteTaskButtonProps) {
  const trpc = useTRPC();
  const router = useRouter();
  const toast = useToast();
  const [error, setError] = useState<string | null>(null);

  const deleteTask = useMutation(trpc.tasks.delete.mutationOptions());

  async function handleDelete() {
    setError(null);

    try {
      await deleteTask.mutateAsync({ id });
      toast(`Deleted "${title}".`);
      // The listing is rendered by a Server Component, so the deleted task
      // stays on screen until Next renders the page again from the store.
      router.refresh();
    } catch (caught) {
      // The server's message already explains known failures ("Task not
      // found.", "Invalid task ID."); anything else is unexpected, so keep it
      // generic instead of surfacing an opaque stack.
      setError(
        caught instanceof TRPCClientError
          ? caught.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleteTask.isPending}
        aria-label={`Delete "${title}"`}
        className="text-sm font-medium text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-400"
      >
        {deleteTask.isPending ? "Deleting…" : "Delete"}
      </button>
      {error ? (
        <p
          role="alert"
          className="text-right text-xs text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
