import Link from "next/link";
import { TaskForm } from "@/components/task-form";

export default function NewTaskPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <Link
        href="/"
        className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
      >
        ← Back to tasks
      </Link>

      <header className="mt-4 mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">New task</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          The title is required; the description is optional.
        </p>
      </header>

      <TaskForm />
    </main>
  );
}
