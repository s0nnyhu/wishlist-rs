import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES_PER_IP = 5;
// Limite globale : protège aussi contre des essais répartis sur plusieurs adresses
const MAX_FAILURES_TOTAL = 30;

export async function clientIp(): Promise<string> {
  const store = await headers();
  return store.get("x-forwarded-for")?.split(",")[0]?.trim() || store.get("x-real-ip") || "inconnue";
}

export async function isLoginLocked(ip: string): Promise<boolean> {
  const since = new Date(Date.now() - WINDOW_MS);
  const [forIp, total] = await Promise.all([
    prisma.loginAttempt.count({ where: { ip, createdAt: { gte: since } } }),
    prisma.loginAttempt.count({ where: { createdAt: { gte: since } } }),
  ]);
  return forIp >= MAX_FAILURES_PER_IP || total >= MAX_FAILURES_TOTAL;
}

export async function recordLoginFailure(ip: string) {
  await prisma.$transaction([
    prisma.loginAttempt.create({ data: { ip } }),
    // Nettoyage des tentatives qui ne comptent plus
    prisma.loginAttempt.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - WINDOW_MS) } } }),
  ]);
}

export async function clearLoginFailures(ip: string) {
  await prisma.loginAttempt.deleteMany({ where: { ip } });
}
