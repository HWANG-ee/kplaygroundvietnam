import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import AdminCategoryManager from "@/components/admin/AdminCategoryManager";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!isAdmin(user.role)) redirect("/admin");

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="container-x py-8">
      <Link href="/admin" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] flex items-center gap-1">
        <ArrowLeft size={16} /> 관리자로 돌아가기 / Quay lại quản trị
      </Link>
      <h1 className="text-3xl font-black my-6">🗂️ 메뉴(카테고리) 관리 / Quản lý menu</h1>
      <p className="text-sm text-[var(--color-muted)] mb-6">
        상단 카테고리 메뉴 항목을 추가·수정·삭제합니다. (상품이 있는 메뉴는 삭제할 수 없어요)
        <br />
        Thêm / sửa / xóa mục menu danh mục. (Menu còn sản phẩm thì không thể xóa)
      </p>
      <AdminCategoryManager
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          kind: c.kind,
          order: c.order,
          productCount: c._count.products,
        }))}
      />
    </div>
  );
}
