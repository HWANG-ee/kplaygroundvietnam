import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, isStaff } from "@/lib/auth";
import AdminProductForm from "@/components/admin/AdminProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const user = await getCurrentUser();
  if (!isStaff(user?.role)) redirect("/");

  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="container-x py-8">
      <Link href="/admin" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)]">
        ← 관리자로 돌아가기
      </Link>
      <h1 className="text-3xl font-black my-6">상품 등록</h1>
      <AdminProductForm categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
    </div>
  );
}
