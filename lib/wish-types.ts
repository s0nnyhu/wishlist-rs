import type { Wish } from "@/lib/generated/prisma/client";

// Un wish tel qu'affiché dans la liste, avec les coups de cœur vus par l'appareil courant
export type ListedWish = Wish & { likeCount: number; liked: boolean };
