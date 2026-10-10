import type { Metadata } from "next";
import { Fraunces, Figtree } from "next/font/google";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${figtree.variable} h-full antialiased`}>
      <body className="min-h-full">
        <main className="relative mx-auto min-h-dvh max-w-[390px] overflow-hidden px-6 pb-32 pt-14">
          {children}
        </main>
      </body>
    </html>
  );
}
