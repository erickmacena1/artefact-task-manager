import { z } from "zod";

/**
 * `createdAt` is an ISO 8601 string rather than a `Date`: no tRPC transformer
 * is configured, so dates would be JSON-serialized to strings anyway. Keeping
 * the type a string means the client's types stay truthful.
 */
export type Task = {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
};

const titleSchema = z
  .string("Title is required.")
  .trim()
  .min(1, "Title is required.");
const descriptionSchema = z.string().trim().optional();

export const createTaskInput = z.object({
  title: titleSchema,
  description: descriptionSchema,
});

export type CreateTaskInput = z.infer<typeof createTaskInput>;

export const updateTaskInput = createTaskInput.extend({
  id: z.uuid("Invalid task ID."),
});

export type UpdateTaskInput = z.infer<typeof updateTaskInput>;

export const taskIdInput = z.object({
  id: z.uuid("Invalid task ID."),
});
