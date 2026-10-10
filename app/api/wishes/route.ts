import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { createWishSchema } from "@/lib/wish-input";
import { invalidateWishes, jsonError, validationError } from "@/lib/api";

export async function POST(request: Request) {
  const profile = await getSession();
  if (!profile) return jsonError("Session expirée, reconnecte-toi.", 401);

  const parsed = createWishSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);

  try {
    await prisma.wish.create({ data: { ...parsed.data, addedBy: profile } });
  } catch (error) {
    console.error("Création d'envie échouée", error);
    return jsonError("L'envie n'a pas pu être enregistrée.", 500);
  }

  invalidateWishes();
  return NextResponse.json({ ok: true }, { status: 201 });
}
