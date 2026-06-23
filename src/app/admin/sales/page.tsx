import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { won } from "@/lib/format";
import { Coins, ShoppingBag, TrendingUp, XCircle, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  결제완료: "bg-[var(--color-mint)] text-[var(--color-ink)]",
  배송중: "bg-[var(--color-sky)] text-white",
  배송완료: "bg-[var(--color-secondary)] text-white",
  결제대기: "bg-[var(--color-accent)] text-[var(--color-ink)]",
  취소: "bg-gray-200 text-gray-500",
};

function dayKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default async function SalesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!isAdmin(user.role)) redirect("/admin"); // 매니저는 매출 접근 불가

  const [orders, items, recent] = await Promise.all([
    prisma.order.findMany({ select: { total: true, status: true, createdAt: true } }),
    prisma.orderItem.findMany({
      include: {
        product: { select: { title: true, artist: true, image: true } },
        order: { select: { status: true } },
      },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 12,
      include: { user: { select: { name: true } }, _count: { select: { items: true } } },
    }),
  ]);

  const paid = orders.filter((o) => o.status !== "취소");
  const totalRevenue = paid.reduce((s, o) => s + o.total, 0);
  const orderCount = paid.length;
  const avgOrder = orderCount ? Math.round(totalRevenue / orderCount) : 0;
  const cancelledCount = orders.length - orderCount;

  // 최근 14일 일별 매출
  const days: { key: string; label: string; revenue: number }[] = [];
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push({ key: dayKey(d), label: `${d.getMonth() + 1}/${d.getDate()}`, revenue: 0 });
  }
  const dayMap = new Map(days.map((d) => [d.key, d]));
  for (const o of paid) {
    const e = dayMap.get(dayKey(new Date(o.createdAt)));
    if (e) e.revenue += o.total;
  }
  const maxDay = Math.max(1, ...days.map((d) => d.revenue));

  // 인기 상품 (취소 제외, 판매수량 기준)
  const prodMap = new Map<string, { title: string; artist: string; image: string; qty: number; revenue: number }>();
  for (const it of items) {
    if (it.order.status === "취소") continue;
    const key = it.productId;
    const cur = prodMap.get(key) || {
      title: it.product.title,
      artist: it.product.artist,
      image: it.product.image,
      qty: 0,
      revenue: 0,
    };
    cur.qty += it.quantity;
    cur.revenue += it.price * it.quantity;
    prodMap.set(key, cur);
  }
  const topProducts = [...prodMap.values()].sort((a, b) => b.qty - a.qty).slice(0, 8);

  const stats = [
    { label: "총 매출", value: won(totalRevenue), icon: Coins, color: "var(--color-accent)" },
    { label: "주문 수", value: `${orderCount}건`, icon: ShoppingBag, color: "var(--color-secondary)" },
    { label: "평균 객단가", value: won(avgOrder), icon: TrendingUp, color: "var(--color-mint)" },
    { label: "취소", value: `${cancelledCount}건`, icon: XCircle, color: "var(--color-muted)" },
  ];

  return (
    <div className="container-x py-8">
      <Link href="/admin" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] flex items-center gap-1">
        <ArrowLeft size={16} /> 관리자로 돌아가기
      </Link>
      <h1 className="text-3xl font-black my-6">📊 매출 분석</h1>

      {/* KPI */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-white ring-1 ring-pink-100 p-5">
            <s.icon size={24} style={{ color: s.color }} />
            <p className="text-2xl font-black mt-3">{s.value}</p>
            <p className="text-sm text-[var(--color-muted)]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* 일별 매출 차트 */}
      <div className="rounded-3xl bg-white ring-1 ring-pink-100 p-6 mb-10">
        <h2 className="text-lg font-black mb-5">최근 14일 일별 매출</h2>
        <div className="flex items-end gap-2 h-48">
          {days.map((d) => (
            <div key={d.key} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="w-full flex items-end justify-center h-40">
                <div
                  className="w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-[var(--color-primary)] to-[var(--color-secondary)] transition-all relative"
                  style={{ height: `${(d.revenue / maxDay) * 100}%`, minHeight: d.revenue > 0 ? 4 : 0 }}
                >
                  {d.revenue > 0 && (
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[var(--color-muted)] whitespace-nowrap opacity-0 group-hover:opacity-100">
                      {won(d.revenue)}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[10px] text-[var(--color-muted)]">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 인기 상품 */}
        <div className="rounded-3xl bg-white ring-1 ring-pink-100 p-6">
          <h2 className="text-lg font-black mb-4">🏆 인기 상품 (판매량)</h2>
          {topProducts.length === 0 ? (
            <p className="text-sm text-[var(--color-muted)] py-8 text-center">판매 데이터가 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-5 text-center font-black text-[var(--color-muted)]">{i + 1}</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt="" className="w-11 h-11 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold line-clamp-1">{p.title}</p>
                    <p className="text-xs text-[var(--color-muted)]">{p.artist}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{p.qty}개</p>
                    <p className="text-xs text-[var(--color-muted)]">{won(p.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 최근 주문 */}
        <div className="rounded-3xl bg-white ring-1 ring-pink-100 p-6">
          <h2 className="text-lg font-black mb-4">🧾 최근 주문</h2>
          {recent.length === 0 ? (
            <p className="text-sm text-[var(--color-muted)] py-8 text-center">주문이 없습니다.</p>
          ) : (
            <div className="space-y-2">
              {recent.map((o) => (
                <div key={o.id} className="flex items-center gap-3 text-sm border-b border-pink-50 pb-2 last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{o.orderNumber}</p>
                    <p className="text-xs text-[var(--color-muted)]">
                      {o.user.name} · {o._count.items}개 · {new Date(o.createdAt).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[o.status] || "bg-gray-100"}`}>
                    {o.status}
                  </span>
                  <span className="font-bold w-24 text-right">{won(o.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
