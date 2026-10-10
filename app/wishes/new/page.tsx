import { createWish } from "@/lib/actions";
import { WishForm } from "@/components/wish-form";

export default function NewWishPage() {
  return <WishForm action={createWish} cancelHref="/" />;
}
