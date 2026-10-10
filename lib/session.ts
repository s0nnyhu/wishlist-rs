import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";

export const PROFILES = ["R", "S"] as const;
export type Profile = (typeof PROFILES)[number];

export const SESSION_COOKIE = "carnet_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

function secret(): string {
  const password = process.env.AUTH_PASSWORD;
  if (!password) throw new Error("AUTH_PASSWORD n'est pas défini");
  return password;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const hashA = createHash("sha256").update(a).digest();
  const hashB = createHash("sha256").update(b).digest();
  return timingSafeEqual(hashA, hashB);
}

export function checkPassword(password: string): boolean {
  return safeEqual(password, secret());
}

export function createSessionValue(profile: Profile): string {
  const payload = `${profile}.${Date.now() + MAX_AGE_SECONDS * 1000}`;
  return `${payload}.${sign(payload)}`;
}

export function readSession(value?: string): Profile | null {
  if (!value) return null;

  const [profile, expiresAt, signature] = value.split(".");
  if (!PROFILES.includes(profile as Profile)) return null;
  if (Number(expiresAt) < Date.now()) return null;
  if (!safeEqual(signature ?? "", sign(`${profile}.${expiresAt}`))) return null;

  return profile as Profile;
}

export async function getSession(): Promise<Profile | null> {
  await connection();
  const store = await cookies();
  return readSession(store.get(SESSION_COOKIE)?.value);
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: MAX_AGE_SECONDS,
};
