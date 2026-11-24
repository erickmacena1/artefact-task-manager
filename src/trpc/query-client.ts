import { QueryClient } from "@tanstack/react-query";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data stays fresh for 30s, so remounting a component doesn't refetch.
        staleTime: 30 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * Returns the QueryClient for the current environment.
 *
 * The browser must reuse a single instance: React discards component state when
 * the initial render suspends, so a client created with `useState` inside a
 * component would be thrown away together with its cache. The server must never
 * reuse one: a fresh client per request keeps request data from leaking into
 * another render.
 */
export function getQueryClient() {
  if (typeof window === "undefined") return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
