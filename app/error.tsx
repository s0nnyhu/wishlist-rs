"use client";

import { useEffect } from "react";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="pt-10 text-center">
      <h1 className="mb-3 font-serif text-3xl font-bold">Oups, un souci</h1>
      <p className="mb-6 text-[15px] text-muted">
        La page n&apos;a pas pu se charger. Réessaie dans un instant.
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="press h-12 rounded-3xl bg-plum px-6 text-base font-semibold text-bg"
      >
        Réessayer
      </button>
    </div>
  );
}
