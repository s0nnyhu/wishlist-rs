"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { clearLoginFailures, clientIp, isLoginLocked, recordLoginFailure } from "@/lib/rate-limit";
import {
  PROFILES,
  SESSION_COOKIE,
  checkPassword,
  createSessionValue,
  sessionCookieOptions,
  type Profile,
} from "@/lib/session";

export type LoginState = { error?: string; profile?: Profile } | null;

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const profile = formData.get("profil");
  const password = String(formData.get("password") ?? "");

  if (!PROFILES.includes(profile as Profile)) return { error: "Choisis ton profil" };

  const ip = await clientIp();
  if (await isLoginLocked(ip)) {
    return { error: "Trop de tentatives. Réessaie dans 15 minutes.", profile: profile as Profile };
  }

  if (!checkPassword(password)) {
    await recordLoginFailure(ip);
    return { error: "Mot de passe incorrect", profile: profile as Profile };
  }

  await clearLoginFailures(ip);
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionValue(profile as Profile), sessionCookieOptions);
  redirect("/");
}

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/connexion");
}
