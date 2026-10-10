"use client";

import { useEffect } from "react";
import { hideToast, useToast } from "@/lib/pending-store";

export function Toast() {
  const message = useToast();

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(hideToast, 6000);
    return () => clearTimeout(timer);
  }, [message]);

  if (!message) return null;

  return (
    <div
      role="alert"
      className="fixed inset-x-0 top-4 z-30 mx-auto flex w-[342px] max-w-[calc(100%-32px)] animate-fade-in items-start gap-3 rounded-2xl bg-ink px-4 py-3 text-sm text-bg shadow-lg"
    >
      <p className="flex-1">{message}</p>
      <button type="button" onClick={hideToast} aria-label="Fermer" className="press text-base leading-none">
        ×
      </button>
    </div>
  );
}
