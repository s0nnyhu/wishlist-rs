import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isLoggedIn } from "@/lib/session";
import { wishInputSchema } from "@/lib/wish-input";
import { invalidateWishes, jsonError, validationError } from "@/lib/api";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  if (!(await isLoggedIn())) return jsonError("Session expirée, reconnecte-toi.", 401);

  const { id } = await params;
  const parsed = wishInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return validationError(parsed.error);

  const { count } = await prisma.wish.updateMany({ where: { id }, data: parsed.data });
  if (count === 0) return jsonError("Ce wish n'existe plus.", 404);

  invalidateWishes();
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: Context) {
  if (!(await isLoggedIn())) return jsonError("Session expirée, reconnecte-toi.", 401);

  const { id } = await params;
  // deleteMany : supprimer un wish déjà supprimé n'est pas une erreur
  await prisma.wish.deleteMany({ where: { id } });

  invalidateWishes();
  return NextResponse.json({ ok: true });
}
