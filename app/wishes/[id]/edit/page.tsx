import { notFound, redirect } from "next/navigation";
import { getWish } from "@/lib/queries";
import { getSession } from "@/lib/session";
import { WishForm } from "@/components/wish-form";

export default async function EditWishPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await getSession())) redirect("/connexion");

  const { id } = await params;
  const wish = await getWish(id);
  if (!wish) notFound();

  return <WishForm wish={wish} />;
}
