"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

// Distance (après amortissement) à dépasser pour déclencher le rafraîchissement
const THRESHOLD = 64;
const MAX_PULL = 100;
// Décalage gardé pendant le chargement, pour laisser l'indicateur visible
const REFRESHING_OFFSET = 52;
// Durée minimale d'affichage de l'indicateur : un rechargement trop rapide passerait inaperçu
const MIN_SPIN_MS = 600;

// Tirer vers le bas en haut de page recharge la liste (absent nativement en mode écran d'accueil iOS)
export function PullToRefresh({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [holding, setHolding] = useState(false);
  const [pull, setPull] = useState(0);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number | null>(null);
  const pullRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function updatePull(value: number) {
      pullRef.current = value;
      setPull(value);
    }

    function onTouchStart(event: TouchEvent) {
      if (window.scrollY > 0 || event.touches.length !== 1) return;
      startY.current = event.touches[0].clientY;
      setDragging(true);
    }

    function onTouchMove(event: TouchEvent) {
      if (startY.current === null) return;
      const distance = event.touches[0].clientY - startY.current;
      if (distance <= 0 || window.scrollY > 0) {
        updatePull(0);
        return;
      }
      // On prend la main sur le geste : pas de rebond natif pendant qu'on tire
      event.preventDefault();
      updatePull(Math.min(MAX_PULL, distance * 0.5));
    }

    function onTouchEnd() {
      if (startY.current === null) return;
      startY.current = null;
      setDragging(false);
      if (pullRef.current >= THRESHOLD) {
        setHolding(true);
        setTimeout(() => setHolding(false), MIN_SPIN_MS);
        startTransition(() => router.refresh());
      }
      updatePull(0);
    }

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    // Non passif : nécessaire pour preventDefault pendant le geste
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd);
    container.addEventListener("touchcancel", onTouchEnd);
    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      container.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [router]);

  const refreshing = isPending || holding;
  const offset = refreshing ? REFRESHING_OFFSET : pull;
  const progress = Math.min(1, pull / THRESHOLD);
  const animate = dragging ? "" : "transition-transform duration-300 ease-out";

  return (
    <div ref={containerRef} className="relative">
      <div
        aria-hidden={!refreshing}
        role="status"
        aria-label={refreshing ? "Actualisation" : undefined}
        className={`pointer-events-none absolute left-1/2 top-0 flex size-9 items-center justify-center rounded-full bg-white text-plum shadow-md ${animate}`}
        style={{
          transform: `translate(-50%, ${offset - 44}px)`,
          opacity: refreshing ? 1 : progress,
        }}
      >
        <RefreshCw
          className={`size-4 ${refreshing ? "animate-spin" : ""}`}
          style={refreshing ? undefined : { transform: `rotate(${progress * 270}deg)` }}
        />
      </div>

      <div className={animate} style={offset > 0 ? { transform: `translateY(${offset}px)` } : undefined}>
        {children}
      </div>
    </div>
  );
}
