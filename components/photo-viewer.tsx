"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDialog } from "@/lib/use-dialog";

// Vignette cliquable qui ouvre la photo en grand, par-dessus toute la page
export function PhotoViewer({ src, title }: { src: string; title: string }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  useDialog(open, () => setOpen(false), closeRef);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Agrandir la photo : ${title}`}
        className="press shrink-0 rounded-xl"
      >
        <Image src={src} alt="" width={72} height={72} className="size-[72px] rounded-xl bg-blush object-cover" />
      </button>

      {open &&
        // Portail : la visionneuse ne doit pas être décalée par les transformations de la liste
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Photo : ${title}`}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 flex animate-fade-in items-center justify-center bg-ink/90 p-4"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer"
              className="press absolute right-4 top-4 flex size-11 items-center justify-center rounded-full bg-white/15 text-white"
            >
              <X aria-hidden="true" className="size-5" />
            </button>

            <Image
              src={src}
              alt={title}
              width={1200}
              height={1200}
              sizes="100vw"
              className="h-auto max-h-[85dvh] w-auto max-w-full animate-zoom-in rounded-2xl object-contain"
            />
          </div>,
          document.body,
        )}
    </>
  );
}
