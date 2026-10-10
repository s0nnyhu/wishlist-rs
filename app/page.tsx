import Link from "next/link";
import { redirect } from "next/navigation";
import { getAllWishes } from "@/lib/queries";
import { getSession } from "@/lib/session";
import { WishList } from "@/components/wish-list";

export default async function HomePage() {
  const viewer = await getSession();
  if (!viewer) redirect("/connexion");

  const wishes = await getAllWishes();

  return (
    <>
      <WishList wishes={wishes} viewer={viewer} />

      <Link
        href="/wishes/new"
        className="press fixed bottom-7 left-1/2 flex h-14 w-[342px] max-w-[calc(100%-48px)] -translate-x-1/2 items-center justify-center rounded-[28px] bg-plum text-base font-semibold text-bg shadow-lg shadow-plum/20"
      >
        + Ajouter une envie
      </Link>
    </>
  );
}
