import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isLoggedIn } from "@/lib/session";
import { getVoterId } from "@/lib/voter";
import { invalidateWishes, jsonError } from "@/lib/api";

type Context = { params: Promise<{ id: string }> };

async function respondWithCount(wishId: string) {
  invalidateWishes();
  const likeCount = await prisma.wishLike.count({ where: { wishId } });
  return NextResponse.json({ likeCount });
}

// Met le coup de cœur de cet appareil
export async function PUT(_request: Request, { params }: Context) {
  if (!(await isLoggedIn())) return jsonError("Session expirée, reconnecte-toi.", 401);
  const voterId = await getVoterId();
  if (!voterId) return jsonError("Appareil non reconnu, recharge la page.", 400);

  const { id } = await params;
  try {
    await prisma.wishLike.upsert({
      where: { wishId_voterId: { wishId: id, voterId } },
      create: { wishId: id, voterId },
      update: {},
    });
  } catch {
    return jsonError("Ce wish n'existe plus.", 404);
  }
  return respondWithCount(id);
}

// Retire le coup de cœur de cet appareil
export async function DELETE(_request: Request, { params }: Context) {
  if (!(await isLoggedIn())) return jsonError("Session expirée, reconnecte-toi.", 401);
  const voterId = await getVoterId();
  if (!voterId) return jsonError("Appareil non reconnu, recharge la page.", 400);

  const { id } = await params;
  await prisma.wishLike.deleteMany({ where: { wishId: id, voterId } });
  return respondWithCount(id);
}
