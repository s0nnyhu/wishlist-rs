import Link from "next/link";
import { LinksField } from "@/components/links-field";
import { PhotoField } from "@/components/photo-field";
import type { Wish } from "@/lib/generated/prisma/client";

const inputClass =
  "mt-1.5 block h-12 w-full rounded-xl border border-line bg-white px-3.5 text-base outline-none focus:outline-2 focus:outline-offset-1 focus:outline-accent";
const labelClass = "mb-3.5 block text-[13px] font-semibold text-body";

type Props = {
  action: (formData: FormData) => Promise<void>;
  wish?: Wish;
  cancelHref: string;
  deleteHref?: string;
};

export function WishForm({ action, wish, cancelHref, deleteHref }: Props) {
  return (
    <form action={action} className="flex flex-col">
      <div className="flex h-11 items-center justify-between">
        <Link href={cancelHref} className="min-h-11 text-base font-semibold text-accent leading-[44px]">
          Annuler
        </Link>
        <span className="text-[13px] text-muted">{wish ? "Ajouté par toi" : "Étape unique"}</span>
      </div>

      <h1 className="mb-[22px] mt-3.5 font-serif text-[38px] font-bold leading-[1.05] tracking-tight">
        {wish ? "Modifier" : "Nouvelle"} <em className="font-medium not-italic text-accent italic">{wish ? "l'envie" : "envie"}</em>
      </h1>

      <PhotoField initialUrl={wish?.photoUrl} />

      <label className={labelClass}>
        Titre
        <input
          name="title"
          required
          defaultValue={wish?.title}
          placeholder="Ex. Casque à réduction de bruit"
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        Prix <span className="font-normal text-muted">(facultatif)</span>
        <input
          name="price"
          inputMode="decimal"
          defaultValue={wish?.price ?? ""}
          placeholder="289 €"
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        Commentaire <span className="font-normal text-muted">(facultatif)</span>
        <textarea
          name="comment"
          rows={3}
          defaultValue={wish?.comment ?? ""}
          placeholder="Le modèle noir, pour les trajets…"
          className="mt-1.5 block w-full resize-none rounded-xl border border-line bg-white px-3.5 py-3 text-base outline-none focus:outline-2 focus:outline-offset-1 focus:outline-accent"
        />
      </label>

      <div className="mb-3.5">
        <LinksField initial={wish?.links} />
      </div>

      {deleteHref && (
        <Link
          href={deleteHref}
          className="mb-3 flex h-12 items-center justify-center rounded-3xl border border-accent text-[15px] font-semibold text-accent"
        >
          Supprimer cette envie
        </Link>
      )}

      <button
        type="submit"
        className="fixed bottom-7 left-1/2 h-14 w-[342px] max-w-[calc(100%-48px)] -translate-x-1/2 rounded-[28px] bg-plum text-base font-semibold text-bg"
      >
        {wish ? "Enregistrer" : "Enregistrer l'envie"}
      </button>
    </form>
  );
}
