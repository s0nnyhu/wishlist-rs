import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, isValidSession } from "@/lib/session";
import { VOTER_COOKIE, isValidVoterId, voterCookieOptions } from "@/lib/voter";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/connexion")) return NextResponse.next();

  if (isValidSession(request.cookies.get(SESSION_COOKIE)?.value)) return withVoterId(request);

  // Les appels d'API reçoivent une erreur JSON, les pages une redirection vers la connexion
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Session expirée, reconnecte-toi." }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/connexion", request.url));
}

// Donne à l'appareil son identifiant anonyme de coups de cœur s'il n'en a pas encore
function withVoterId(request: NextRequest) {
  if (isValidVoterId(request.cookies.get(VOTER_COOKIE)?.value)) return NextResponse.next();

  const voterId = crypto.randomUUID();
  // Visible dès cette requête par la page ou l'API, puis enregistré dans le navigateur
  request.cookies.set(VOTER_COOKIE, voterId);
  const response = NextResponse.next({ request: { headers: request.headers } });
  response.cookies.set(VOTER_COOKIE, voterId, voterCookieOptions);
  return response;
}

export const config = {
  // Icônes et manifeste restent publics : iOS les récupère sans être connecté
  matcher: ["/((?!_next/static|_next/image|icon|apple-icon|manifest.webmanifest).*)"],
};
