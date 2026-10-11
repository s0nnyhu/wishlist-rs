import type { Owner } from "@/lib/generated/prisma/enums";

type OwnerInfo = {
  value: Owner;
  // Nom de l'onglet
  label: string;
  slug: string;
  // « Liste de Rojo », « Liste commune »
  listTitle: string;
  // Suite de « + Ajouter un wish … »
  addSuffix: string;
};

// Les listes de la page d'accueil, dans l'ordre des onglets
export const OWNERS: OwnerInfo[] = [
  { value: "ROJO", label: "Rojo", slug: "rojo", listTitle: "Liste de Rojo", addSuffix: "pour Rojo" },
  { value: "SONNY", label: "Sonny", slug: "sonny", listTitle: "Liste de Sonny", addSuffix: "pour Sonny" },
  { value: "COMMUN", label: "Commun", slug: "commun", listTitle: "Liste commune", addSuffix: "commun" },
];

export function ownerFromSlug(slug: string): Owner | null {
  return OWNERS.find((owner) => owner.slug === slug)?.value ?? null;
}

export function ownerInfo(owner: Owner): OwnerInfo {
  return OWNERS.find((item) => item.value === owner) ?? OWNERS[0];
}
