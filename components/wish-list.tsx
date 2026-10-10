"use client";

import { useEffect, useState } from "react";
import type { Wish } from "@/lib/generated/prisma/client";
import type { Profile } from "@/lib/session";
import { logout } from "@/lib/actions";
import { applyChanges, pruneChanges, usePendingChanges } from "@/lib/pending-store";
import { SubmitButton } from "@/components/submit-button";
import { WishCard } from "@/components/wish-card";

type Filter = "all" | "theirs" | "mine";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "Toutes" },
  { value: "theirs", label: "Les siennes" },
  { value: "mine", label: "Les miennes" },
];

const emptyMessages: Record<Filter, string> = {
  all: "Rien pour l'instant. Ajoute la première envie.",
  theirs: "Aucune envie de son côté pour l'instant.",
  mine: "Tu n'as encore rien ajouté.",
};

export function WishList({ wishes, viewer }: { wishes: Wish[]; viewer: Profile }) {
  const [filter, setFilter] = useState<Filter>("all");
  const pending = usePendingChanges();

  // Dès que la liste du serveur reflète un changement en attente, on le retire
  useEffect(() => pruneChanges(wishes), [wishes]);

  const displayed = applyChanges(wishes, pending, viewer);
  // Le filtre est appliqué dans le navigateur : changer d'onglet est instantané
  const visible = displayed.filter((wish) => {
    if (filter === "mine") return wish.addedBy === viewer;
    if (filter === "theirs") return wish.addedBy !== viewer;
    return true;
  });

  return (
    <>
      <div className="flex items-center justify-between text-[13px] text-muted">
        <form action={logout}>
          <SubmitButton pendingLabel="Déconnexion…" className="font-semibold text-accent">
            Profil {viewer} · Quitter
          </SubmitButton>
        </form>
        <span>
          {displayed.length} {displayed.length > 1 ? "envies" : "envie"}
        </span>
      </div>

      <h1 className="mb-2 mt-3 font-serif text-[46px] font-bold leading-none tracking-tight">
        Nos <em className="font-medium text-accent">envies</em>
      </h1>
      <p className="mb-5 text-[15px] text-muted">Ajoute ce qui te fait envie, même les folies.</p>

      <div role="group" aria-label="Filtrer les envies" className="mb-[18px] flex gap-2">
        {filters.map((item) => {
          const active = item.value === filter;
          return (
            <button
              key={item.value}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(item.value)}
              className={`press rounded-full px-3.5 py-2 text-sm transition-colors ${
                active ? "bg-plum font-semibold text-bg" : "border border-plum/25"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div key={filter} className="animate-fade-in">
        {visible.map((wish) => (
          <WishCard key={wish.id} wish={wish} viewer={viewer} pending={wish.pending} />
        ))}
        {visible.length === 0 && <p className="mt-8 text-center text-muted">{emptyMessages[filter]}</p>}
      </div>
    </>
  );
}
