import { ImageResponse } from "next/og";
import { LogoMark } from "@/lib/logo";

const SIZES = [32, 192, 512];

// Favicon et icônes du manifeste, servies sur /icon/32, /icon/192 et /icon/512
export function generateImageMetadata() {
  return SIZES.map((size) => ({
    id: String(size),
    size: { width: size, height: size },
    contentType: "image/png",
  }));
}

export default async function Icon({ id }: { id: Promise<string> }) {
  const size = Number(await id);
  return new ImageResponse(<LogoMark size={size} />, { width: size, height: size });
}
