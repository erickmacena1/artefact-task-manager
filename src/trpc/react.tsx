"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { useState } from "react";
import { getQueryClient } from "./query-client";
// Type-only import: the routers (and the server-only code behind them) must not
// be pulled into the browser bundle, where `node:crypto` does not exist.
import type { AppRouter } from "./routers/_app";

const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

/** The browser can call a relative URL; server-side rendering needs one that resolves. */
function getUrl() {
  if (typeof window !== "undefined") return "/api/trpc";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/api/trpc`;
  return "http://localhost:3000/api/trpc";
}

export function TRPCReactProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient();
  // Created once per provider mount; rebuilding it on every render would drop
  // in-flight requests and their results.
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [httpBatchLink({ url: getUrl() })],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}

export { useTRPC };
