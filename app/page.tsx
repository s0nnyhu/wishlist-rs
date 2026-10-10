import { redirect } from "next/navigation";
import { getAllWishes } from "@/lib/queries";
import { isLoggedIn } from "@/lib/session";
import { WishList } from "@/components/wish-list";

export default async function HomePage() {
  if (!(await isLoggedIn())) redirect("/connexion");

  const wishes = await getAllWishes();
  return <WishList wishes={wishes} />;
}
