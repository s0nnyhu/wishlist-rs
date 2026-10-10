"use server";

import { put } from "@vercel/blob";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { withProtocol } from "@/lib/format";
import {
  PROFILES,
  SESSION_COOKIE,
  checkPassword,
  createSessionValue,
  getSession,
  sessionCookieOptions,
  type Profile,
} from "@/lib/session";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export type LoginState = { error?: string } | null;

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const profile = formData.get("profil");
  const password = String(formData.get("password") ?? "");

  if (!PROFILES.includes(profile as Profile)) return { error: "Choisis ton profil" };
  if (!checkPassword(password)) return { error: "Mot de passe incorrect" };

  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionValue(profile as Profile), sessionCookieOptions);
  redirect("/");
}

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/connexion");
}

function parseWishForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const price = String(formData.get("price") ?? "").trim() || null;
  const comment = String(formData.get("comment") ?? "").trim() || null;
  const photoUrl = String(formData.get("photoUrl") ?? "").trim() || null;
  const links = formData
    .getAll("links")
    .map((link) => String(link).trim())
    .filter(Boolean)
    .map(withProtocol);

  return { title, price, comment, photoUrl, links };
}

export async function uploadPhoto(formData: FormData): Promise<string> {
  if (!(await getSession())) redirect("/connexion");

  const file = formData.get("photo");
  if (!(file instanceof File) || !file.type.startsWith("image/") || file.size > MAX_PHOTO_BYTES) {
    throw new Error("Image invalide ou trop lourde (5 Mo max)");
  }

  const blob = await put(`wishes/${crypto.randomUUID()}.jpg`, file, {
    access: "public",
    contentType: file.type,
  });
  return blob.url;
}

export async function createWish(formData: FormData) {
  const profile = await getSession();
  if (!profile) redirect("/connexion");

  const data = parseWishForm(formData);
  if (!data.title) return;

  await prisma.wish.create({ data: { ...data, addedBy: profile } });
  updateTag("wishes");
  redirect("/");
}

export async function updateWish(id: string, formData: FormData) {
  if (!(await getSession())) redirect("/connexion");

  const data = parseWishForm(formData);
  if (!data.title) return;

  await prisma.wish.update({ where: { id }, data });
  updateTag("wishes");
  redirect("/");
}

export async function deleteWish(id: string) {
  if (!(await getSession())) redirect("/connexion");

  await prisma.wish.delete({ where: { id } });
  updateTag("wishes");
  redirect("/");
}
