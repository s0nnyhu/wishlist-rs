import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, isValidSession } from "@/lib/session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/connexion")) return NextResponse.next();

  if (isValidSession(request.cookies.get(SESSION_COOKIE)?.value)) return NextResponse.next();

  // Les appels d'API reçoivent une erreur JSON, les pages une redirection vers la connexion
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Session expirée, reconnecte-toi." }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/connexion", request.url));
}

export const config = {
  // Icônes et manifeste restent publics : iOS les récupère sans être connecté
  matcher: ["/((?!_next/static|_next/image|icon|apple-icon|manifest.webmanifest).*)"],
};
