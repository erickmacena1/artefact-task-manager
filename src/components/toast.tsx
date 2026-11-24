"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Toast = {
  id: number;
  message: string;
};

type ShowToast = (message: string) => void;

const ToastContext = createContext<ShowToast | null>(null);

/** How long a toast stays on screen before it dismisses itself. */
const TOAST_DURATION_MS = 4000;

/**
 * Renders a toast viewport above the app. Mounted in the root layout so the
 * toasts state lives outside the page subtree: a delete refresh re-renders the
 * listing and unmounts the delete button, but the confirmation survives.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string) => {
    const id = nextId.current++;
    setToasts((current) => [...current, { id, message }]);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4"
      >
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: number) => void;
}) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), TOAST_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [onDismiss, toast.id]);

  return (
    <p className="pointer-events-auto w-full max-w-md rounded-lg border border-emerald-600/30 bg-white px-4 py-2 text-sm text-emerald-700 shadow-lg dark:bg-zinc-900 dark:text-emerald-400">
      {toast.message}
    </p>
  );
}

export function useToast() {
  const showToast = useContext(ToastContext);
  if (!showToast) {
    throw new Error("useToast() can only be used inside of a <ToastProvider>");
  }
  return showToast;
}
