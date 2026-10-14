"use client";

import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { showToast } from "@/lib/pending-store";

type Props = {
  wishId: string;
  liked: boolean;
  count: number;
  disabled?: boolean;
  className?: string;
};

// Étoile « coup de cœur » : bascule tout de suite, le serveur suit en arrière-plan
export function LikeButton({
  wishId,
  liked: initialLiked,
  count: initialCount,
  disabled = false,
  className = "",
}: Props) {
  const router = useRouter();
  const [state, setState] = useState({ liked: initialLiked, count: initialCount });
  // Seule la réponse au dernier appui compte, même en tapant plusieurs fois vite
  const lastRequest = useRef(0);

  async function toggle() {
    const previous = state;
    const liked = !previous.liked;
    setState({ liked, count: Math.max(0, previous.count + (liked ? 1 : -1)) });

    const requestId = ++lastRequest.current;
    try {
      const response = await fetch(`/api/wishes/${wishId}/like`, { method: liked ? "PUT" : "DELETE" });
      const data = (await response.json().catch(() => null)) as { likeCount?: number; error?: string } | null;
      if (requestId !== lastRequest.current) return;
      if (!response.ok) throw new Error(data?.error ?? "Une erreur est survenue.");
      if (typeof data?.likeCount === "number") setState({ liked, count: data.likeCount });
      router.refresh();
    } catch (error) {
      if (requestId !== lastRequest.current) return;
      setState(previous);
      showToast(`Le coup de cœur n'a pas été enregistré. ${error instanceof Error ? error.message : ""}`.trim());
    }
  }

  const label = state.liked
    ? `Retirer ton coup de cœur, ${state.count} au total`
    : `Ajouter un coup de cœur, ${state.count === 0 ? "0 pour l'instant" : `${state.count} au total`}`;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={disabled}
      aria-pressed={state.liked}
      aria-label={label}
      className={`press inline-flex items-center gap-1 text-sm font-semibold transition-colors ${
        state.liked ? "text-accent" : "text-muted"
      } ${className}`}
    >
      <Star
        aria-hidden="true"
        key={String(state.liked)}
        className={`size-[18px] ${state.liked ? "animate-pop" : ""}`}
        fill={state.liked ? "currentColor" : "none"}
        strokeWidth={1.75}
      />
      {state.count}
    </button>
  );
}
