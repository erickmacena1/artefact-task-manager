import { createCallerFactory, createTRPCContext } from "./init";
import { appRouter } from "./routers/_app";

const createCaller = createCallerFactory(appRouter);

/**
 * Runs tRPC procedures in-process for Server Components.
 *
 * Unlike the client in `client.tsx`, this never goes over HTTP: the rendered
 * HTML already contains the data, which is what makes the page SSR.
 */
export async function getServerCaller() {
  return createCaller(await createTRPCContext());
}
