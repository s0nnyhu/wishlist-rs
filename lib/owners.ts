import type { Owner } from "@/lib/generated/prisma/enums";

// Les deux listes de la page d'accueil, dans l'ordre des onglets
export const OWNERS: { value: Owner; label: string; slug: string }[] = [
  { value: "ROJO", label: "Rojo", slug: "rojo" },
  { value: "SONNY", label: "Sonny", slug: "sonny" },
];

export function ownerFromSlug(slug: string): Owner | null {
  return OWNERS.find((owner) => owner.slug === slug)?.value ?? null;
}

export function ownerLabel(owner: Owner): string {
  return OWNERS.find((item) => item.value === owner)?.label ?? owner;
}

export function ownerSlug(owner: Owner): string {
  return OWNERS.find((item) => item.value === owner)?.slug ?? owner.toLowerCase();
}
