import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { won } from "@/lib/format";

export const dynamic = "force-dynamic";

const STATUS_STYLE: Record<string, string> = {
  결제완료: "bg-[var(--color-secondary)]/15 text-[var(--color-secondary)]",
  배송중: "bg-[var(--color-sky)]/15 text-[var(--color-sky)]",
  배송완료: "bg-[var(--color-mint)]/20 text-[var(--color-ink)]",
  취소: "bg-pink-100 text-[var(--color-muted)]",
};

export default async function MyPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container-x py-8">
      <h1 className="text-3xl font-black mb-8">마이페이지</h1>

      {/* profile card */}
      <div className="rounded-3xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white p-7 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-white/80 text-sm">안녕하세요 👋</p>
            <p className="text-2xl font-black">{user.name}님</p>
            <p className="text-white/80 text-sm mt-1">{user.email}</p>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-3xl font-black">{orders.length}</p>
              <p className="text-xs text-white/80">주문</p>
            </div>
            <div>
              <p className="text-3xl font-black">{user.mileage.toLocaleString()}</p>
              <p className="text-xs text-white/80">마일리지</p>
            </div>
            {user.role === "admin" && (
              <Link href="/admin" className="self-center bg-white text-[var(--color-primary)] font-bold px-5 py-2.5 rounded-full">
                관리자 페이지
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* orders */}
      <h2 className="text-xl font-black mb-4">📦 주문 내역</h2>
      {orders.length === 0 ? (
        <div className="rounded-3xl bg-white ring-1 ring-pink-100 p-12 text-center text-[var(--color-muted)]">
          아직 주문 내역이 없어요.
          <Link href="/" className="block mt-4 text-[var(--color-primary)] font-semibold">쇼핑하러 가기</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-3xl bg-white ring-1 ring-pink-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_STYLE[o.status] || ""}`}>
                    {o.status}
                  </span>
                  <span className="text-sm text-[var(--color-muted)] ml-3">
                    {o.orderNumber} · {o.createdAt.toLocaleDateString("ko-KR")}
                  </span>
                </div>
                <span className="font-black">{won(o.total)}</span>
              </div>
              <div className="space-y-3">
                {o.items.map((it) => (
                  <Link
                    key={it.id}
                    href={`/product/${it.product.slug}`}
                    className="flex gap-3 items-center group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.product.image} alt={it.product.title} className="w-14 h-14 rounded-xl object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold group-hover:text-[var(--color-primary)] line-clamp-1">
                        {it.product.title}
                      </p>
                      <p className="text-xs text-[var(--color-muted)]">
                        {it.version && `${it.version} · `}수량 {it.quantity} · {won(it.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <form action="/api/auth/logout" method="post" className="mt-10 text-center">
        <button className="text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] underline">
          로그아웃
        </button>
      </form>
    </div>
  );
}
