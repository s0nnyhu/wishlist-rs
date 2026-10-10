"use client";

import { useEffect } from "react";
import type { Wish } from "@/lib/generated/prisma/client";
import { logout } from "@/lib/actions";
import { applyChanges, pruneChanges, usePendingChanges } from "@/lib/pending-store";
import { SubmitButton } from "@/components/submit-button";
import { WishCard } from "@/components/wish-card";

export function WishList({ wishes }: { wishes: Wish[] }) {
  const pending = usePendingChanges();

  // Dès que la liste du serveur reflète un changement en attente, on le retire
  useEffect(() => pruneChanges(wishes), [wishes]);

  const displayed = applyChanges(wishes, pending);

  return (
    <>
      <div className="flex items-center justify-between text-[13px] text-muted">
        <form action={logout}>
          <SubmitButton pendingLabel="Déconnexion…" className="font-semibold text-accent">
            Se déconnecter
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

      {displayed.map((wish) => (
        <WishCard key={wish.id} wish={wish} pending={wish.pending} />
      ))}
      {displayed.length === 0 && (
        <p className="mt-8 text-center text-muted">Rien pour l&apos;instant. Ajoute la première envie.</p>
      )}
    </>
  );
}
