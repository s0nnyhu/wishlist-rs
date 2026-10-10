import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Pencil } from "lucide-react";
import type { Wish } from "@/lib/generated/prisma/client";
import { timeAgo, withProtocol } from "@/lib/format";

type Props = { wish: Wish; pending?: boolean };

export function WishCard({ wish, pending = false }: Props) {
  const firstLink = wish.links[0];

  return (
    <article
      aria-busy={pending}
      className={`mb-3 flex gap-3.5 rounded-2xl border border-line bg-white p-4 transition-opacity ${pending ? "opacity-70" : ""}`}
    >
      {wish.photoUrl && (
        <Image
          src={wish.photoUrl}
          alt=""
          width={72}
          height={72}
          className="size-[72px] shrink-0 rounded-xl bg-blush object-cover"
        />
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-serif text-lg font-medium leading-tight">{wish.title}</h2>
          {wish.price && <span className="whitespace-nowrap text-sm font-semibold">{wish.price}</span>}
        </div>

        {wish.comment && <p className="mb-2.5 mt-1.5 text-sm italic text-body">« {wish.comment} »</p>}

        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[13px] text-muted">
          {firstLink ? (
            <a
              href={withProtocol(firstLink)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 whitespace-nowrap font-semibold text-accent"
            >
              <ExternalLink aria-hidden="true" className="size-3.5" />
              Voir le lien
            </a>
          ) : (
            <span />
          )}
          <span className="ml-auto flex items-center gap-3">
            {/* Le temps relatif peut différer de quelques secondes entre serveur et navigateur */}
            <span suppressHydrationWarning className="whitespace-nowrap">
              {timeAgo(wish.createdAt)}
            </span>
            {pending ? (
              <span className="font-semibold">Enregistrement…</span>
            ) : (
              <Link
                href={`/wishes/${wish.id}/edit`}
                className="press inline-flex items-center gap-1 font-semibold text-accent"
              >
                <Pencil aria-hidden="true" className="size-3.5" />
                Modifier
              </Link>
            )}
          </span>
        </div>
      </div>
    </article>
  );
}
