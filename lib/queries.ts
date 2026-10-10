import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "@/lib/prisma";

// Tous les wishes, mises en cache et invalidées par updateTag("wishes") après chaque modification
export async function getAllWishes() {
  "use cache";
  cacheTag("wishes");
  cacheLife("max");

  return prisma.wish.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getWish(id: string) {
  "use cache";
  cacheTag("wishes");
  cacheLife("max");

  return prisma.wish.findUnique({ where: { id } });
}
