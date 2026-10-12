import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { ListedWish } from "@/lib/wish-types";

// Tous les wishes et leurs coups de cœur, mis en cache et invalidés après chaque modification
export async function getAllWishes() {
  "use cache";
  cacheTag("wishes");
  cacheLife("max");

  return prisma.wish.findMany({
    orderBy: { createdAt: "desc" },
    include: { likes: { select: { voterId: true } } },
  });
}

// Version pour l'affichage : on ne transmet au navigateur que le total et le vote de cet appareil
export async function getListedWishes(voterId: string | null): Promise<ListedWish[]> {
  const wishes = await getAllWishes();
  return wishes.map(({ likes, ...wish }) => ({
    ...wish,
    likeCount: likes.length,
    liked: voterId !== null && likes.some((like) => like.voterId === voterId),
  }));
}

export async function getWish(id: string) {
  "use cache";
  cacheTag("wishes");
  cacheLife("max");

  return prisma.wish.findUnique({ where: { id } });
}
