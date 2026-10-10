import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";

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

// Session signée : "session.<expiration>.<signature>"
export function createSessionValue(): string {
  const payload = `session.${Date.now() + MAX_AGE_SECONDS * 1000}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidSession(value?: string): boolean {
  if (!value) return false;

  const [kind, expiresAt, signature] = value.split(".");
  if (kind !== "session" || Number(expiresAt) < Date.now()) return false;
  return safeEqual(signature ?? "", sign(`${kind}.${expiresAt}`));
}

export async function isLoggedIn(): Promise<boolean> {
  await connection();
  const store = await cookies();
  return isValidSession(store.get(SESSION_COOKIE)?.value);
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: MAX_AGE_SECONDS,
};
