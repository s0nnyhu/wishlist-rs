"use client";

import { useRouter } from "next/navigation";
import type { Owner } from "@/lib/generated/prisma/enums";
import { addChange, confirmChange, removeChange, showToast, type PendingChange } from "@/lib/pending-store";
import { useGoBack } from "@/components/back-link";
import { wishInputSchema } from "@/lib/wish-input";
import type { readWishForm } from "@/lib/wish-input";

type RawWishInput = ReturnType<typeof readWishForm>;

async function send(url: string, method: string, body?: unknown): Promise<string | null> {
  try {
    const response = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (response.ok) return null;
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    return data?.error ?? "Une erreur est survenue.";
  } catch {
    return "Connexion impossible. Vérifie ton réseau et réessaie.";
  }
}

function parseOrToast(raw: RawWishInput) {
  const parsed = wishInputSchema.safeParse(raw);
  if (!parsed.success) showToast(parsed.error.issues[0]?.message ?? "Données invalides.");
  return parsed.success ? parsed.data : null;
}

// Mutations optimistes : l'écran change tout de suite, le serveur est appelé en arrière-plan
export function useWishMutations() {
  const router = useRouter();
  const goBack = useGoBack();

  async function run(change: PendingChange, request: () => Promise<string | null>, failure: string) {
    addChange(change);
    goBack();

    const error = await request();
    if (error) {
      removeChange(change);
      showToast(`${failure} ${error}`);
    } else {
      confirmChange(change);
    }
    // Récupère la liste à jour : le changement en attente sera retiré quand elle le reflétera
    router.refresh();
  }

  return {
    create(raw: RawWishInput, owner: Owner) {
      const input = parseOrToast(raw);
      if (!input) return;
      const id = crypto.randomUUID();
      return run(
        { type: "create", id, input, owner, at: Date.now() },
        () => send("/api/wishes", "POST", { ...raw, id, owner }),
        "Le wish n'a pas été ajouté.",
      );
    },
    update(id: string, raw: RawWishInput) {
      const input = parseOrToast(raw);
      if (!input) return;
      return run(
        { type: "update", id, input, at: Date.now() },
        () => send(`/api/wishes/${id}`, "PATCH", raw),
        "La modification n'a pas été enregistrée.",
      );
    },
    remove(id: string) {
      return run(
        { type: "delete", id, at: Date.now() },
        () => send(`/api/wishes/${id}`, "DELETE"),
        "Le wish n'a pas été supprimé.",
      );
    },
  };
}
