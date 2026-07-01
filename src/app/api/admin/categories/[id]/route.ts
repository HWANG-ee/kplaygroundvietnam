import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, isAdmin } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!isAdmin(session?.role)) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }
  const { id } = await params;
  try {
    const b = await req.json();
    const data: { name?: string; kind?: string; order?: number } = {};
    if (typeof b.name === "string" && b.name.trim()) data.name = b.name.trim();
    if (b.kind === "album" || b.kind === "goods") data.kind = b.kind;
    if (typeof b.order === "number") data.order = b.order;
    await prisma.category.update({ where: { id }, data });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "수정 실패 / Cập nhật thất bại" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!isAdmin(session?.role)) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }
  const { id } = await params;
  try {
    const count = await prisma.product.count({ where: { categoryId: id } });
    if (count > 0) {
      return NextResponse.json(
        { error: `이 카테고리에 상품 ${count}개가 있어 삭제할 수 없습니다. / Còn ${count} sản phẩm, không thể xóa.` },
        { status: 400 }
      );
    }
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "삭제 실패 / Xóa thất bại" }, { status: 500 });
  }
}
