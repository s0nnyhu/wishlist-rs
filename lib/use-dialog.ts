"use client";

import { useEffect, useEffectEvent, type RefObject } from "react";

// Comportements communs aux fenêtres par-dessus la page : focus initial,
// fermeture avec Échap et défilement de la page bloqué tant qu'elle est ouverte
export function useDialog(open: boolean, onClose: () => void, initialFocus: RefObject<HTMLElement | null>) {
  const close = useEffectEvent(onClose);

  useEffect(() => {
    if (!open) return;

    initialFocus.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, initialFocus]);
}
