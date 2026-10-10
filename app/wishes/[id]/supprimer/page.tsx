import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAllWishes, getWish } from "@/lib/queries";
import { deleteWish } from "@/lib/actions";
import { getSession } from "@/lib/session";
import { WishCard } from "@/components/wish-card";

export default async function DeleteWishPage({ params }: { params: Promise<{ id: string }> }) {
  const viewer = await getSession();
  if (!viewer) redirect("/connexion");

  const { id } = await params;
  const [wish, wishes] = await Promise.all([getWish(id), getAllWishes()]);
  if (!wish) notFound();

  return (
    <>
      <div className="flex justify-end text-[13px] text-muted">{wishes.length} envies</div>
      <h1 className="mb-2 mt-3 font-serif text-[46px] font-bold leading-none tracking-tight">
        Nos <em className="font-medium not-italic text-accent italic">envies</em>
      </h1>
      <div className="mt-5">
        {wishes.map((item) => (
          <WishCard key={item.id} wish={item} viewer={viewer} dimmed showEdit={false} />
        ))}
      </div>

      <div className="fixed inset-0 bg-plum/45" />

      <div
        role="dialog"
        aria-labelledby="titre-suppr"
        className="fixed inset-x-0 bottom-0 z-10 mx-auto max-w-[390px] rounded-t-[28px] bg-white px-6 pb-9 pt-3 shadow-[0_-8px_30px_rgba(62,10,29,0.2)]"
      >
        <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-line" />
        <h2 id="titre-suppr" className="mb-2.5 font-serif text-[26px] font-bold leading-tight">
          Supprimer cette envie ?
        </h2>
        <p className="mb-6 text-[15px] leading-relaxed text-body">
          « {wish.title} » sera retiré de la liste pour vous deux. Cette action est définitive.
        </p>
        <div className="flex gap-2.5">
          <Link
            href={`/wishes/${id}/edit`}
            className="flex h-13 flex-1 items-center justify-center rounded-[26px] border border-plum text-base font-semibold text-plum"
          >
            Annuler
          </Link>
          <form action={deleteWish.bind(null, id)} className="flex-1">
            <button
              type="submit"
              className="h-13 w-full rounded-[26px] bg-accent text-base font-semibold text-white"
            >
              Supprimer
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
