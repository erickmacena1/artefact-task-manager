import { TRPCError } from "@trpc/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TaskForm } from "@/components/task-form";
import { getServerCaller } from "@/trpc/server";

// Tasks live in memory and change at runtime, so this page renders per request.
export const dynamic = "force-dynamic";

export default async function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trpc = await getServerCaller();

  const task = await trpc.tasks.byId({ id }).catch((error: unknown) => {
    // A missing task and a malformed id both mean there is nothing to edit.
    if (
      error instanceof TRPCError &&
      (error.code === "NOT_FOUND" || error.code === "BAD_REQUEST")
    ) {
      notFound();
    }
    throw error;
  });

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <Link
        href="/"
        className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
      >
        ← Back to tasks
      </Link>

      <header className="mt-4 mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Edit task</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Update the task and save your changes.
        </p>
      </header>

      {/* Keyed so a different task id remounts the form with fresh state. */}
      <TaskForm key={task.id} task={task} />
    </main>
  );
}
