import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, isStaff } from "@/lib/auth";

async function requireStaff() {
  const session = await getSession();
  if (!isStaff(session?.role)) return null;
  return session;
}

function slugify(s: string) {
  // ASCII-only slug to avoid URL-encoding issues with Korean characters
  const base = s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return (base || "item") + "-" + Math.floor(1000 + Math.random() * 9000);
}

export async function POST(req: NextRequest) {
  if (!(await requireStaff())) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }
  try {
    const b = await req.json();
    const emoji = b.emoji || "♪";
    const c = Math.floor(Math.random() * 10);
    const image =
      b.image ||
      `/api/cover?t=${encodeURIComponent(b.title)}&a=${encodeURIComponent(b.artist)}&c=${c}&e=${encodeURIComponent(emoji)}`;

    const product = await prisma.product.create({
      data: {
        slug: slugify(b.artist + "-" + b.title),
        title: b.title,
        artist: b.artist,
        description: b.description || "",
        image,
        images: JSON.stringify([]),
        price: Number(b.price),
        salePrice: Number(b.salePrice),
        stock: Number(b.stock ?? 100),
        versions: JSON.stringify(
          (b.versions || "")
            .split(",")
            .map((v: string) => v.trim())
            .filter(Boolean)
        ),
        badge: b.badge || "",
        isPreorder: !!b.isPreorder,
        isNew: !!b.isNew,
        isBest: !!b.isBest,
        isHotDeal: !!b.isHotDeal,
        isRestocked: !!b.isRestocked,
        categoryId: b.categoryId,
      },
    });
    return NextResponse.json({ ok: true, id: product.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "상품 생성 실패" }, { status: 500 });
  }
}
