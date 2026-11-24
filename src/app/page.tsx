import Link from "next/link";
import { DeleteTaskButton } from "@/components/delete-task-button";
import type { Task } from "@/lib/tasks";
import { getServerCaller } from "@/trpc/server";

// The store lives in memory and changes at runtime, so this page must render
// on every request instead of being prerendered once at build time.
export const dynamic = "force-dynamic";

const createdAtFormat = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

function TaskItem({ task }: { task: Task }) {
  return (
    <li className="rounded-xl border border-black/10 p-4 dark:border-white/15">
      <h2 className="font-medium break-words">{task.title}</h2>
      {task.description ? (
        <p className="mt-1 text-sm whitespace-pre-line break-words text-zinc-600 dark:text-zinc-400">
          {task.description}
        </p>
      ) : null}
      <div className="mt-3 flex items-center justify-between gap-4">
        <time dateTime={task.createdAt} className="text-xs text-zinc-500">
          Created {createdAtFormat.format(new Date(task.createdAt))}
        </time>
        <div className="flex items-center gap-3">
          <Link
            href={`/tasks/${task.id}/edit`}
            className="text-sm font-medium text-zinc-700 hover:underline dark:text-zinc-300"
          >
            Edit
          </Link>
          <DeleteTaskButton id={task.id} title={task.title} />
        </div>
      </div>
    </li>
  );
}

export default async function TasksPage() {
  const trpc = await getServerCaller();
  const tasks = await trpc.tasks.list();

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {tasks.length === 0
              ? "No tasks yet."
              : `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`}
          </p>
        </div>
        <Link
          href="/tasks/new"
          className="shrink-0 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          New task
        </Link>
      </header>

      {tasks.length === 0 ? (
        <p className="rounded-xl border border-dashed border-black/15 px-4 py-12 text-center text-sm text-zinc-500 dark:border-white/15">
          Tasks you create will appear here.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </ul>
      )}
    </main>
  );
}
