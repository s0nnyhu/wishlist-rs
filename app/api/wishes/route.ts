import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isLoggedIn } from "@/lib/session";
import { createWishSchema } from "@/lib/wish-input";
import { invalidateWishes, jsonError, validationError } from "@/lib/api";

export async function POST(request: Request) {
  if (!(await isLoggedIn())) return jsonError("Session expirée, reconnecte-toi.", 401);

  const parsed = createWishSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);

  try {
    await prisma.wish.create({ data: parsed.data });
  } catch (error) {
    console.error("Création de wish échouée", error);
    return jsonError("Le wish n'a pas pu être enregistré.", 500);
  }

  invalidateWishes();
  return NextResponse.json({ ok: true }, { status: 201 });
}
