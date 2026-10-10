import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getAllWishes } from "@/lib/queries";
import { getSession } from "@/lib/session";
import { logout } from "@/lib/actions";
import { WishCard } from "@/components/wish-card";

const filters = [
  { value: "all", label: "Toutes" },
  { value: "theirs", label: "Les siennes" },
  { value: "mine", label: "Les miennes" },
] as const;

export default function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  return (
    <Suspense>
      <WishList searchParams={searchParams} />
    </Suspense>
  );
}

async function WishList({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const viewer = await getSession();
  if (!viewer) redirect("/connexion");

  const { filter } = await searchParams;
  const activeFilter = filter === "mine" || filter === "theirs" ? filter : "all";

  const allWishes = await getAllWishes();
  const wishes = allWishes.filter((wish) => {
    if (activeFilter === "mine") return wish.addedBy === viewer;
    if (activeFilter === "theirs") return wish.addedBy !== viewer;
    return true;
  });

  return (
    <>
      <div className="flex items-center justify-between text-[13px] text-muted">
        <form action={logout}>
          <button type="submit" className="font-semibold text-accent">
            Profil {viewer} · Quitter
          </button>
        </form>
        <span>{allWishes.length} envies</span>
      </div>

      <h1 className="mb-2 mt-3 font-serif text-[46px] font-bold leading-none tracking-tight">
        Nos <em className="font-medium not-italic text-accent italic">envies</em>
      </h1>
      <p className="mb-5 text-[15px] text-muted">Ajoute ce qui te fait envie, même les folies.</p>

      <nav className="mb-[18px] flex gap-2">
        {filters.map((item) => {
          const active = item.value === activeFilter;
          return (
            <Link
              key={item.value}
              href={item.value === "all" ? "/" : `/?filter=${item.value}`}
              className={`rounded-full px-3.5 py-2 text-sm ${
                active ? "bg-plum font-semibold text-bg" : "border border-plum/25"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {wishes.map((wish) => (
        <WishCard key={wish.id} wish={wish} viewer={viewer} />
      ))}

      {wishes.length === 0 && (
        <p className="mt-8 text-center text-muted">Rien pour l&apos;instant. Ajoute la première envie.</p>
      )}

      <Link
        href="/wishes/new"
        aria-label="Ajouter une envie"
        className="fixed bottom-7 left-1/2 flex h-14 w-[342px] max-w-[calc(100%-48px)] -translate-x-1/2 items-center justify-center rounded-[28px] bg-plum text-base font-semibold text-bg"
      >
        + Ajouter une envie
      </Link>
    </>
  );
}
