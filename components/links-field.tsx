"use client";

import { useState } from "react";

export function LinksField({ initial = [] }: { initial?: string[] }) {
  const [links, setLinks] = useState<string[]>(initial.length ? initial : []);

  return (
    <div>
      <div className="mb-1.5 text-[13px] font-semibold text-body">
        Liens <span className="font-normal text-muted">(facultatif)</span>
      </div>

      {links.map((link, index) => (
        <div
          key={index}
          className="mb-2.5 flex h-12 items-center gap-2 rounded-xl border border-line bg-white pl-3.5 pr-1.5"
        >
          <input
            name="links"
            defaultValue={link}
            placeholder="shop.exemple.com/casque"
            className="min-w-0 flex-1 bg-transparent text-[15px] outline-none"
          />
          <button
            type="button"
            aria-label="Retirer ce lien"
            onClick={() => setLinks(links.filter((_, i) => i !== index))}
            className="flex size-9 items-center justify-center rounded-full bg-blush text-lg text-plum"
          >
            ×
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => setLinks([...links, ""])}
        className="h-12 w-full rounded-xl border border-dashed border-accent text-[15px] font-semibold text-accent"
      >
        + Ajouter un lien
      </button>
    </div>
  );
}
