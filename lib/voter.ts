import { cookies } from "next/headers";

// Identifiant anonyme de l'appareil, posé par le proxy : sert à compter un coup de cœur par appareil
export const VOTER_COOKIE = "carnet_voter";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidVoterId(value?: string): value is string {
  return Boolean(value && UUID.test(value));
}

export async function getVoterId(): Promise<string | null> {
  const value = (await cookies()).get(VOTER_COOKIE)?.value;
  return isValidVoterId(value) ? value : null;
}

export const voterCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 365 * 5,
};
