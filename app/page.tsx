import { redirect } from "next/navigation";
import { getListedWishes } from "@/lib/queries";
import { isLoggedIn } from "@/lib/session";
import { getVoterId } from "@/lib/voter";
import { WishList } from "@/components/wish-list";

export default async function HomePage() {
  if (!(await isLoggedIn())) redirect("/connexion");

  const wishes = await getListedWishes(await getVoterId());
  return <WishList wishes={wishes} />;
}
