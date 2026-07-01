import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, isAdmin } from "@/lib/auth";

function slugify(s: string) {
  const base = s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
  return (base || "cat") + "-" + Math.floor(1000 + Math.random() * 9000);
}

export async function POST(req: NextRequest) {
  // 카테고리(메뉴) 추가: 관리자 전용
  const session = await getSession();
  if (!isAdmin(session?.role)) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }
  try {
    const b = await req.json();
    const name = (b.name || "").trim();
    if (!name) {
      return NextResponse.json({ error: "이름을 입력하세요. / Vui lòng nhập tên." }, { status: 400 });
    }
    const kind = b.kind === "goods" ? "goods" : "album";
    const max = await prisma.category.aggregate({ _max: { order: true } });
    const cat = await prisma.category.create({
      data: { name, slug: slugify(name), kind, order: (max._max.order ?? 0) + 1 },
    });
    return NextResponse.json({ ok: true, id: cat.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "추가 실패 / Thêm thất bại" }, { status: 500 });
  }
}
