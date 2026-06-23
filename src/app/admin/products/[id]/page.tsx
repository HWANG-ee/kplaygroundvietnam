import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, isStaff } from "@/lib/auth";
import { parseJsonArray } from "@/lib/format";
import AdminProductForm from "@/components/admin/AdminProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!isStaff(user?.role)) redirect("/");

  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <div className="container-x py-8">
      <Link href="/admin" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)]">
        ← 관리자로 돌아가기
      </Link>
      <h1 className="text-3xl font-black my-6">상품 수정</h1>
      <AdminProductForm
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        initial={{
          id: product.id,
          title: product.title,
          artist: product.artist,
          description: product.description,
          image: product.image,
          price: product.price,
          salePrice: product.salePrice,
          stock: product.stock,
          versions: parseJsonArray(product.versions).join(", "),
          badge: product.badge,
          categoryId: product.categoryId,
          isPreorder: product.isPreorder,
          isNew: product.isNew,
          isBest: product.isBest,
          isHotDeal: product.isHotDeal,
          isRestocked: product.isRestocked,
        }}
      />
    </div>
  );
}
