import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wishlist",
    short_name: "Wishlist",
    description: "Nos wishes à deux",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf1f4",
    theme_color: "#fbf1f4",
    icons: [
      { src: "/icon/192", sizes: "192x192", type: "image/png" },
      { src: "/icon/512", sizes: "512x512", type: "image/png" },
    ],
  };
}
