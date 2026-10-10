"use client";

import { Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Props = {
  title: string;
  onConfirm: () => void;
};

// Confirmation en feuille du bas, ouverte sans navigation
export function DeleteSheet({ title, onConfirm }: Props) {
  const [open, setOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    cancelRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="press mt-3.5 flex h-12 w-full items-center justify-center gap-2 rounded-3xl border border-accent text-[15px] font-semibold text-accent"
      >
        <Trash2 aria-hidden="true" className="size-4" />
        Supprimer ce wish
      </button>

      {open && (
        <div className="fixed inset-0 z-20">
          <div aria-hidden="true" onClick={() => setOpen(false)} className="absolute inset-0 animate-fade-in bg-plum/45" />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titre-suppr"
            className="absolute inset-x-0 bottom-0 mx-auto max-w-[390px] animate-slide-up rounded-t-[28px] bg-white px-6 pb-9 pt-3 shadow-[0_-8px_30px_rgba(62,10,29,0.2)]"
          >
            <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-line" />
            <h2 id="titre-suppr" className="mb-2.5 font-serif text-[26px] font-bold leading-tight">
              Supprimer ce wish ?
            </h2>
            <p className="mb-6 text-[15px] leading-relaxed text-body">
              « {title} » sera retiré de la liste pour vous deux. Cette action est définitive.
            </p>
            <div className="flex gap-2.5">
              <button
                ref={cancelRef}
                type="button"
                onClick={() => setOpen(false)}
                className="press h-13 flex-1 rounded-[26px] border border-plum text-base font-semibold text-plum"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onConfirm();
                }}
                className="press flex h-13 flex-1 items-center justify-center gap-2 rounded-[26px] bg-accent text-base font-semibold text-white"
              >
                <Trash2 aria-hidden="true" className="size-4" />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
