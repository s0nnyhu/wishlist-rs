import { ImageResponse } from "next/og";
import { LogoMark } from "@/lib/logo";

// Icône « Ajouter à l'écran d'accueil » sur iPhone (iOS arrondit les coins lui-même)
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<LogoMark size={size.width} />, size);
}
