import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, isStaff, isAdmin } from "@/lib/auth";
import { won } from "@/lib/format";
import AdminProductTable from "@/components/admin/AdminProductTable";
import { Plus, Package, ShoppingBag, Users, Coins, BarChart3, Settings } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!isStaff(user.role)) redirect("/");

  const admin = isAdmin(user.role);

  const [products, categories, orderCount, userCount, revenueAgg] =
    await Promise.all([
      prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({ orderBy: { order: "asc" } }),
      admin ? prisma.order.count() : Promise.resolve(0),
      admin ? prisma.user.count() : Promise.resolve(0),
      admin
        ? prisma.order.aggregate({
            where: { status: { not: "취소" } },
            _sum: { total: true },
          })
        : Promise.resolve({ _sum: { total: 0 } }),
    ]);

  // 관리자: 전체 통계 / 매니저: 상품 수만
  const stats = admin
    ? [
        { label: "상품", value: products.length, icon: Package, color: "var(--color-primary)" },
        { label: "주문", value: orderCount, icon: ShoppingBag, color: "var(--color-secondary)" },
        { label: "회원", value: userCount, icon: Users, color: "var(--color-mint)" },
        { label: "총 매출", value: won(revenueAgg._sum.total || 0), icon: Coins, color: "var(--color-accent)" },
      ]
    : [
        { label: "상품", value: products.length, icon: Package, color: "var(--color-primary)" },
      ];

  return (
    <div className="container-x py-8">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-2">
            {admin ? "🛠️ 관리자" : "📦 매니저"}
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                admin
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-mint)] text-[var(--color-ink)]"
              }`}
            >
              {admin ? "ADMIN" : "MANAGER"}
            </span>
          </h1>
          <p className="text-[var(--color-muted)] text-sm mt-1">
            {admin
              ? "사이트 전체 관리 · 매출 분석"
              : "상품 관리 (등록·수정·삭제) · 매출 분석은 관리자 전용"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {admin && (
            <Link
              href="/admin/sales"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white ring-1 ring-pink-100 font-bold hover:ring-[var(--color-primary)]"
            >
              <BarChart3 size={20} /> 매출 분석
            </Link>
          )}
          {admin && (
            <Link
              href="/admin/settings"
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white ring-1 ring-pink-100 font-bold hover:ring-[var(--color-primary)]"
            >
              <Settings size={20} /> 사이트 설정
            </Link>
          )}
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:bg-[var(--color-primary-dark)]"
          >
            <Plus size={20} /> 상품 등록
          </Link>
        </div>
      </div>

      <div className={`grid gap-4 mb-10 ${admin ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 max-w-xs"}`}>
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
        canDelete={true}
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
