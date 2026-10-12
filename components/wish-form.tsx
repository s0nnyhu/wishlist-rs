"use client";

import { useLayoutEffect, useState } from "react";
import { BackLink } from "@/components/back-link";
import { DeleteSheet } from "@/components/delete-sheet";
import { LinksField } from "@/components/links-field";
import { PhotoField } from "@/components/photo-field";
import type { Wish } from "@/lib/generated/prisma/client";
import type { Owner } from "@/lib/generated/prisma/enums";
import { ownerInfo } from "@/lib/owners";
import { stripEuro } from "@/lib/format";
import { useWishMutations } from "@/lib/use-wish-mutations";
import { readWishForm } from "@/lib/wish-input";

const inputClass =
  "mt-1.5 block h-12 w-full rounded-xl border border-line bg-white px-3.5 text-base outline-none focus:outline-2 focus:outline-offset-1 focus:outline-accent";
const labelClass = "mb-3.5 block text-[13px] font-semibold text-body";

type Props =
  | { wish: Wish; owner?: never }
  | { wish?: never; owner: Owner };

export function WishForm({ wish, owner }: Props) {
  const mutations = useWishMutations();
  // Next garde les pages quittées en mémoire (React Activity) et les réaffiche telles quelles.
  // Quand la page est cachée, on change la clé du formulaire : au retour, il repart des valeurs
  // d'origine (champs vides pour un ajout, données à jour pour une modification).
  const [formKey, setFormKey] = useState(0);
  useLayoutEffect(() => () => setFormKey((key) => key + 1), []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = readWishForm(new FormData(event.currentTarget));
    if (wish) mutations.update(wish.id, input);
    else mutations.create(input, owner);
  }

  return (
    <>
      <div className="flex h-11 items-center justify-between">
        <BackLink className="press text-base font-semibold leading-[44px] text-accent">Annuler</BackLink>
        <span className="text-[13px] text-muted">{ownerInfo(wish ? wish.owner : owner).listTitle}</span>
      </div>

      <h1 className="mb-[22px] mt-3.5 font-serif text-[38px] font-bold leading-[1.05] tracking-tight">
        {wish ? "Modifier" : "Nouveau"} <em className="font-medium text-accent">{wish ? "le wish" : "wish"}</em>
      </h1>

      <form key={formKey} onSubmit={handleSubmit}>
        <PhotoField initialUrl={wish?.photoUrl} />

        <label className={labelClass}>
          Titre
          <input
            name="title"
            required
            maxLength={200}
            defaultValue={wish?.title}
            placeholder="Ex. Casque à réduction de bruit"
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          Prix <span className="font-normal text-muted">(facultatif)</span>
          <span className="relative mt-1.5 block">
            <input
              name="price"
              inputMode="decimal"
              maxLength={50}
              defaultValue={stripEuro(wish?.price ?? "")}
              placeholder="289"
              className={`${inputClass.replace("mt-1.5 ", "")} pr-10`}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-base font-semibold text-muted"
            >
              €
            </span>
          </span>
        </label>

        <label className={labelClass}>
          Commentaire <span className="font-normal text-muted">(facultatif)</span>
          <textarea
            name="comment"
            rows={3}
            maxLength={2000}
            defaultValue={wish?.comment ?? ""}
            placeholder="Le modèle noir, pour les trajets…"
            className="mt-1.5 block w-full resize-none rounded-xl border border-line bg-white px-3.5 py-3 text-base outline-none focus:outline-2 focus:outline-offset-1 focus:outline-accent"
          />
        </label>

        <LinksField initial={wish?.links} />

        <button
          type="submit"
          className="press fixed bottom-7 left-1/2 z-10 h-14 w-[342px] max-w-[calc(100%-48px)] -translate-x-1/2 rounded-[28px] bg-plum text-base font-semibold text-bg shadow-lg shadow-plum/20"
        >
          {wish ? "Enregistrer" : "Enregistrer le wish"}
        </button>
      </form>

      {wish && <DeleteSheet title={wish.title} onConfirm={() => mutations.remove(wish.id)} />}
    </>
  );
}
