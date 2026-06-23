import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") return null;
  return session;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }
  const { id } = await params;
  try {
    const b = await req.json();
    await prisma.product.update({
      where: { id },
      data: {
        title: b.title,
        artist: b.artist,
        description: b.description || "",
        ...(b.image ? { image: b.image } : {}),
        price: Number(b.price),
        salePrice: Number(b.salePrice),
        stock: Number(b.stock),
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
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "수정 실패" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }
  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "삭제 실패 (주문 내역이 있는 상품일 수 있습니다)" }, { status: 500 });
  }
}
