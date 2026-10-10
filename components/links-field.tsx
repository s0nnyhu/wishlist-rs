"use client";

import { useState } from "react";

type LinkRow = { key: number; value: string };

let nextKey = 0;
const toRow = (value: string): LinkRow => ({ key: nextKey++, value });

export function LinksField({ initial = [] }: { initial?: string[] }) {
  // Clé stable par ligne : retirer un lien au milieu ne mélange pas les valeurs saisies
  const [links, setLinks] = useState<LinkRow[]>(() => initial.map(toRow));

  return (
    <div>
      <div className="mb-1.5 text-[13px] font-semibold text-body">
        Liens <span className="font-normal text-muted">(facultatif)</span>
      </div>

      {links.map((link) => (
        <div
          key={link.key}
          className="mb-2.5 flex h-12 items-center gap-2 rounded-xl border border-line bg-white pl-3.5 pr-1.5"
        >
          <input
            name="links"
            defaultValue={link.value}
            maxLength={2000}
            placeholder="shop.exemple.com/casque"
            className="min-w-0 flex-1 bg-transparent text-[15px] outline-none"
          />
          <button
            type="button"
            aria-label="Retirer ce lien"
            onClick={() => setLinks(links.filter((row) => row.key !== link.key))}
            className="press flex size-9 items-center justify-center rounded-full bg-blush text-lg text-plum"
          >
            ×
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => setLinks([...links, toRow("")])}
        disabled={links.length >= 10}
        className="press h-12 w-full rounded-xl border border-dashed border-accent text-[15px] font-semibold text-accent disabled:opacity-50"
      >
        + Ajouter un lien
      </button>
    </div>
  );
}
