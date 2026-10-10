import { z } from "zod";
import { withProtocol } from "@/lib/format";

// Seules les photos de notre store Vercel Blob public sont acceptées
const BLOB_URL = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i;

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((value) => value || null)
    .nullable();

export const wishInputSchema = z.object({
  title: z.string().trim().min(1, "Le titre est obligatoire").max(200),
  price: optionalText(50),
  comment: optionalText(2000),
  photoUrl: z
    .string()
    .regex(BLOB_URL, "Photo invalide")
    .nullable()
    .or(z.literal("").transform(() => null)),
  links: z
    .array(z.string().trim().max(2000))
    .max(10)
    .transform((links) => links.filter(Boolean).map(withProtocol)),
});

export const createWishSchema = wishInputSchema.extend({ id: z.uuid() });

export type WishInput = z.output<typeof wishInputSchema>;

// Lit le formulaire de wish côté navigateur, dans la forme attendue par l'API
export function readWishForm(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    price: String(formData.get("price") ?? ""),
    comment: String(formData.get("comment") ?? ""),
    photoUrl: String(formData.get("photoUrl") ?? ""),
    links: formData.getAll("links").map(String),
  };
}
