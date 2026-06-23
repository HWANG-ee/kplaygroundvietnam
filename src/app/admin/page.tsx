import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { won } from "@/lib/format";
import AdminProductTable from "@/components/admin/AdminProductTable";
import { Plus, Package, ShoppingBag, Users, Coins } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/");

  const [products, categories, orderCount, userCount, revenueAgg] =
    await Promise.all([
      prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({ orderBy: { order: "asc" } }),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
    ]);

  const stats = [
    { label: "상품", value: products.length, icon: Package, color: "var(--color-primary)" },
    { label: "주문", value: orderCount, icon: ShoppingBag, color: "var(--color-secondary)" },
    { label: "회원", value: userCount, icon: Users, color: "var(--color-mint)" },
    { label: "총 매출", value: won(revenueAgg._sum.total || 0), icon: Coins, color: "var(--color-accent)" },
  ];

  return (
    <div className="container-x py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black">🛠️ 관리자</h1>
          <p className="text-[var(--color-muted)] text-sm mt-1">K-PLAYGROUND 상품 관리</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:bg-[var(--color-primary-dark)]"
        >
          <Plus size={20} /> 상품 등록
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white ring-1 ring-pink-100 p-5">
            <s.icon size={24} style={{ color: s.color }} />
            <p className="text-2xl font-black mt-3">{s.value}</p>
            <p className="text-sm text-[var(--color-muted)]">{s.label}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-black mb-4">상품 목록</h2>
      <AdminProductTable
        products={products.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          artist: p.artist,
          image: p.image,
          price: p.price,
          salePrice: p.salePrice,
          stock: p.stock,
          badge: p.badge,
          category: p.category.name,
        }))}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}
