import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import type { z } from "zod";

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export function validationError(error: z.ZodError) {
  return jsonError(error.issues[0]?.message ?? "Données invalides", 400);
}

// Expiration immédiate : la prochaine lecture de la liste est fraîche
export function invalidateWishes() {
  revalidateTag("wishes", { expire: 0 });
}
