import { notFound } from "next/navigation";
import { OWNERS, ownerFromSlug } from "@/lib/owners";
import { WishForm } from "@/components/wish-form";

// /wishes/new/rojo et /wishes/new/sonny sont générées au build : l'ouverture reste instantanée
export function generateStaticParams() {
  return OWNERS.map((owner) => ({ owner: owner.slug }));
}

export default async function NewWishPage({ params }: { params: Promise<{ owner: string }> }) {
  const owner = ownerFromSlug((await params).owner);
  if (!owner) notFound();

  return <WishForm owner={owner} />;
}
