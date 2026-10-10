"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import type { Wish } from "@/lib/generated/prisma/client";
import type { Owner } from "@/lib/generated/prisma/enums";
import { logout } from "@/lib/actions";
import { OWNERS, ownerLabel, ownerSlug } from "@/lib/owners";
import { applyChanges, pruneChanges, usePendingChanges } from "@/lib/pending-store";
import { SubmitButton } from "@/components/submit-button";
import { BrandTitle } from "@/components/brand-title";
import { WishCard } from "@/components/wish-card";

// Onglet actif conservé entre les navigations : après un ajout, on revient sur le bon onglet
let lastOwner: Owner = OWNERS[0].value;

export function WishList({ wishes }: { wishes: Wish[] }) {
  const [owner, setOwner] = useState<Owner>(lastOwner);
  const pending = usePendingChanges();

  // Dès que la liste du serveur reflète un changement en attente, on le retire
  useEffect(() => pruneChanges(wishes), [wishes]);

  useEffect(() => {
    lastOwner = owner;
  }, [owner]);

  const visible = applyChanges(wishes, pending).filter((wish) => wish.owner === owner);
  const label = ownerLabel(owner);

  return (
    <>
      <div className="flex items-center justify-between text-[13px] text-muted">
        <form action={logout}>
          <SubmitButton
            pendingLabel="Déconnexion…"
            className="inline-flex items-center gap-1.5 font-semibold text-accent"
          >
            <LogOut aria-hidden="true" className="size-3.5" />
            Se déconnecter
          </SubmitButton>
        </form>
        <span>
          {visible.length} {visible.length > 1 ? "wishes" : "wish"}
        </span>
      </div>

      <BrandTitle className="mb-2 mt-3 text-[46px]" />
      <p className="mb-5 text-[15px] text-muted">Ajoute ce qui te fait envie ma BELLE</p>

      <div role="tablist" aria-label="Listes" className="mb-[18px] grid grid-cols-2 gap-1 rounded-[14px] bg-[#f0d9e1] p-1">
        {OWNERS.map((item) => {
          const active = item.value === owner;
          return (
            <button
              key={item.value}
              type="button"
              role="tab"
              id={`onglet-${item.slug}`}
              aria-selected={active}
              aria-controls="liste-wishes"
              onClick={() => setOwner(item.value)}
              className={`press rounded-[10px] py-2.5 text-[15px] font-semibold transition-colors ${
                active ? "bg-plum text-bg shadow-sm" : "text-plum"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div
        key={owner}
        id="liste-wishes"
        role="tabpanel"
        aria-labelledby={`onglet-${ownerSlug(owner)}`}
        className="animate-fade-in"
      >
        {visible.map((wish) => (
          <WishCard key={wish.id} wish={wish} pending={wish.pending} />
        ))}
        {visible.length === 0 && (
          <p className="mt-8 text-center text-muted">Rien pour l&apos;instant dans la liste de {label}.</p>
        )}
      </div>

      <Link
        href={`/wishes/new/${ownerSlug(owner)}`}
        className="press fixed bottom-7 left-1/2 flex h-14 w-[342px] max-w-[calc(100%-48px)] -translate-x-1/2 items-center justify-center rounded-[28px] bg-plum text-base font-semibold text-bg shadow-lg shadow-plum/20"
      >
        + Ajouter un wish pour {label}
      </Link>
    </>
  );
}
