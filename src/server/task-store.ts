import { randomUUID } from "node:crypto";
import type { CreateTaskInput, Task } from "@/lib/tasks";

/**
 * Tasks live in memory for the whole server process (there is no database).
 * Anchoring the Map on `globalThis` keeps the data alive across Turbopack hot
 * reloads and shares one instance between the route handler and RSC renders,
 * which can otherwise evaluate this module in separate bundles.
 */
const globalStore = globalThis as typeof globalThis & {
  taskStore?: Map<string, Task>;
};
const tasks = (globalStore.taskStore ??= new Map<string, Task>());

export const taskStore = {
  list(): Task[] {
    // Newest first; ISO strings sort chronologically.
    return [...tasks.values()].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  },

  get(id: string): Task | undefined {
    return tasks.get(id);
  },

  create(input: CreateTaskInput): Task {
    const task: Task = {
      id: randomUUID(),
      title: input.title,
      description: input.description || undefined,
      createdAt: new Date().toISOString(),
    };
    tasks.set(task.id, task);
    return task;
  },

  update(id: string, input: CreateTaskInput): Task | undefined {
    const current = tasks.get(id);
    if (!current) return undefined;

    const updated: Task = {
      ...current,
      title: input.title,
      description: input.description || undefined,
    };
    tasks.set(id, updated);
    return updated;
  },

  /** Returns `false` when no task with `id` exists. */
  delete(id: string): boolean {
    return tasks.delete(id);
  },
};
