import { TRPCError } from "@trpc/server";
import {
  createTaskInput,
  deleteTaskInput,
  updateTaskInput,
} from "@/lib/tasks";
import { taskStore } from "@/server/task-store";
import { baseProcedure, createTRPCRouter } from "../init";

const notFound = () =>
  new TRPCError({ code: "NOT_FOUND", message: "Task not found." });

export const tasksRouter = createTRPCRouter({
  list: baseProcedure.query(() => taskStore.list()),

  create: baseProcedure
    .input(createTaskInput)
    .mutation(({ input }) => taskStore.create(input)),

  update: baseProcedure.input(updateTaskInput).mutation(({ input }) => {
    const { id, ...fields } = input;
    const task = taskStore.update(id, fields);
    if (!task) throw notFound();
    return task;
  }),

  delete: baseProcedure.input(deleteTaskInput).mutation(({ input }) => {
    if (!taskStore.delete(input.id)) throw notFound();
    return { id: input.id };
  }),
});
