import Image from "next/image";
import Link from "next/link";
import type { Wish } from "@/lib/generated/prisma/client";
import type { Profile } from "@/lib/session";
import { timeAgo, withProtocol } from "@/lib/format";

type Props = {
  wish: Wish;
  viewer: Profile;
  dimmed?: boolean;
  showEdit?: boolean;
};

export function WishCard({ wish, viewer, dimmed = false, showEdit = true }: Props) {
  const author = wish.addedBy === viewer ? "toi" : wish.addedBy;
  const firstLink = wish.links[0];

  return (
    <article
      className={`mb-3 flex gap-3.5 rounded-2xl border border-line bg-white p-4 ${dimmed ? "opacity-50" : ""}`}
    >
      {wish.photoUrl && (
        <Image
          src={wish.photoUrl}
          alt=""
          width={72}
          height={72}
          className="size-[72px] shrink-0 rounded-xl object-cover"
        />
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-serif text-lg font-medium leading-tight">{wish.title}</h2>
          {wish.price && <span className="whitespace-nowrap text-sm font-semibold">{wish.price}</span>}
        </div>

        {wish.comment && (
          <p className="mb-2.5 mt-1.5 text-sm italic text-body">« {wish.comment} »</p>
        )}

        <div className="mt-2.5 flex items-center justify-between gap-2 text-[13px] text-muted">
          {firstLink ? (
            <a href={withProtocol(firstLink)} target="_blank" rel="noreferrer" className="font-semibold text-accent">
              Voir le lien →
            </a>
          ) : (
            <span />
          )}
          <span className="flex items-center gap-3">
            <span>
              par {author} · {timeAgo(wish.createdAt)}
            </span>
            {showEdit && (
              <Link href={`/wishes/${wish.id}/edit`} className="font-semibold text-accent">
                Modifier
              </Link>
            )}
          </span>
        </div>
      </div>
    </article>
  );
}
