import { useSyncExternalStore } from "react";
import type { Wish } from "@/lib/generated/prisma/client";
import type { WishInput } from "@/lib/wish-input";

// Changements affichés avant la réponse du serveur (mise à jour optimiste).
// Ils sont retirés dès que les données du serveur les reflètent, ou en cas d'échec.
export type PendingChange = (
  | { type: "create"; id: string; input: WishInput }
  | { type: "update"; id: string; input: WishInput }
  | { type: "delete"; id: string }
) & { at: number; confirmed?: boolean };

export type DisplayedWish = Wish & { pending?: boolean };

let changes: PendingChange[] = [];
let toast: string | null = null;
const listeners = new Set<() => void>();
const EMPTY: PendingChange[] = [];

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function addChange(change: PendingChange) {
  changes = [...changes.filter((item) => item.id !== change.id), change];
  emit();
}

export function removeChange(change: PendingChange) {
  changes = changes.filter((item) => item !== change);
  emit();
}

// Le serveur a accepté le changement : il pourra être retiré à la prochaine liste reçue
export function confirmChange(change: PendingChange) {
  change.confirmed = true;
}

// Retire les changements que les données du serveur reflètent déjà
export function pruneChanges(serverWishes: Wish[]) {
  const ids = new Set(serverWishes.map((wish) => wish.id));
  const next = changes.filter((change) => {
    if (change.type === "create") return !ids.has(change.id);
    if (change.type === "delete") return ids.has(change.id);
    return !change.confirmed;
  });
  if (next.length !== changes.length) {
    changes = next;
    emit();
  }
}

export function usePendingChanges() {
  return useSyncExternalStore(subscribe, () => changes, () => EMPTY);
}

export function showToast(message: string) {
  toast = message;
  emit();
}

export function hideToast() {
  toast = null;
  emit();
}

export function useToast() {
  return useSyncExternalStore(subscribe, () => toast, () => null);
}

// Applique les changements en attente à la liste venue du serveur
export function applyChanges(wishes: Wish[], pending: PendingChange[]): DisplayedWish[] {
  let result: DisplayedWish[] = wishes;

  for (const change of pending) {
    if (change.type === "delete") {
      result = result.filter((wish) => wish.id !== change.id);
    } else if (change.type === "update") {
      result = result.map((wish) => (wish.id === change.id ? { ...wish, ...change.input, pending: true } : wish));
    } else if (!result.some((wish) => wish.id === change.id)) {
      const now = new Date(change.at);
      result = [
        { ...change.input, id: change.id, addedBy: null, createdAt: now, updatedAt: now, pending: true },
        ...result,
      ];
    }
  }

  return result;
}
