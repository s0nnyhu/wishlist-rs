"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { clearLoginFailures, clientIp, isLoginLocked, recordLoginFailure } from "@/lib/rate-limit";
import { SESSION_COOKIE, checkPassword, createSessionValue, sessionCookieOptions } from "@/lib/session";

export type LoginState = { error?: string } | null;

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");

  const ip = await clientIp();
  if (await isLoginLocked(ip)) {
    return { error: "Trop de tentatives. Réessaie dans 15 minutes." };
  }

  if (!checkPassword(password)) {
    await recordLoginFailure(ip);
    return { error: "Mot de passe incorrect" };
  }

  await clearLoginFailures(ip);
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionValue(), sessionCookieOptions);
  redirect("/");
}

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/connexion");
}
