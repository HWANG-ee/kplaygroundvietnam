import "server-only";
import { prisma } from "./prisma";

/** 사이트 설정(싱글톤) 조회. 없으면 기본값으로 생성. */
export async function getSiteSettings() {
  const existing = await prisma.siteSetting.findUnique({ where: { id: "site" } });
  if (existing) return existing;
  return prisma.siteSetting.create({ data: { id: "site" } });
}

export type SiteSettings = Awaited<ReturnType<typeof getSiteSettings>>;
