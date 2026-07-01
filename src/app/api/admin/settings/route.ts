import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, isAdmin } from "@/lib/auth";

const FIELDS = [
  "companyName",
  "ceo",
  "bizNumber",
  "mailOrderNumber",
  "address",
  "privacyOfficer",
  "phone",
  "hours",
  "instagram",
  "youtube",
  "twitter",
  "announceKo",
  "announceVi",
  "announceEn",
  "heroMainImage",
  "heroHotImage",
  "heroGoodsImage",
] as const;

export async function PUT(req: NextRequest) {
  // 사이트 설정 변경: 관리자 전용
  const session = await getSession();
  if (!isAdmin(session?.role)) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }
  try {
    const b = await req.json();
    const data: Record<string, string> = {};
    for (const f of FIELDS) {
      if (typeof b[f] === "string") data[f] = b[f];
    }
    await prisma.siteSetting.upsert({
      where: { id: "site" },
      update: data,
      create: { id: "site", ...data },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "저장 실패" }, { status: 500 });
  }
}
