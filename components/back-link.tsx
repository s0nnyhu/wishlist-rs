"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

// Passe à true dès qu'une navigation a eu lieu dans l'app : router.back() reste alors dans l'app
let hasNavigatedInApp = false;

export function NavigationTracker() {
  const pathname = usePathname();
  const firstPathname = useRef(pathname);

  useEffect(() => {
    if (pathname !== firstPathname.current) hasNavigatedInApp = true;
  }, [pathname]);

  return null;
}

// Retour instantané via l'historique quand on vient de l'app, sinon vers l'accueil
export function useGoBack() {
  const router = useRouter();
  return () => (hasNavigatedInApp ? router.back() : router.push("/"));
}

export function BackLink({ children, className }: { children: React.ReactNode; className?: string }) {
  const goBack = useGoBack();

  return (
    <Link
      href="/"
      className={className}
      onClick={(event) => {
        event.preventDefault();
        goBack();
      }}
    >
      {children}
    </Link>
  );
}
