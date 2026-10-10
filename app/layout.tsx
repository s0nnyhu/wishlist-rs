import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Fraunces, Figtree } from "next/font/google";
import { NavigationTracker } from "@/components/back-link";
import { Toast } from "@/components/toast";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-fraunces",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: "Carnet",
  description: "Nos envies à deux",
};

export const viewport: Viewport = {
  themeColor: "#fbf1f4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${figtree.variable} h-full antialiased`}>
      <body className="min-h-full">
        <Suspense fallback={null}>
          <NavigationTracker />
        </Suspense>
        <Toast />
        <main className="relative mx-auto min-h-dvh max-w-[390px] px-6 pb-32 pt-14">{children}</main>
      </body>
    </html>
  );
}
