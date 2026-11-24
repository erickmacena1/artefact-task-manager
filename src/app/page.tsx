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
      <time
        dateTime={task.createdAt}
        className="mt-3 block text-xs text-zinc-500"
      >
        Created {createdAtFormat.format(new Date(task.createdAt))}
      </time>
    </li>
  );
}

export default async function TasksPage() {
  const trpc = await getServerCaller();
  const tasks = await trpc.tasks.list();

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {tasks.length === 0
            ? "No tasks yet."
            : `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`}
        </p>
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
