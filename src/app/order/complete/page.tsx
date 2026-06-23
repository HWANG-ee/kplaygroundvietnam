import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { won } from "@/lib/format";
import { CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrderCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ no?: string }>;
}) {
  const { no } = await searchParams;
  const session = await getSession();
  if (!session) redirect("/login");

  const order = no
    ? await prisma.order.findUnique({
        where: { orderNumber: no },
        include: { items: { include: { product: true } } },
      })
    : null;

  if (!order || order.userId !== session.userId) {
    return (
      <div className="container-x py-24 text-center">
        <p className="text-[var(--color-muted)]">주문 정보를 찾을 수 없습니다.</p>
        <Link href="/" className="inline-block mt-4 text-[var(--color-primary)] font-semibold">홈으로</Link>
      </div>
    );
  }

  return (
    <div className="container-x py-16 max-w-2xl">
      <div className="text-center mb-8">
        <CheckCircle2 className="mx-auto text-[var(--color-mint)] animate-bob" size={64} />
        <h1 className="text-2xl font-black mt-4">주문이 완료되었어요! 🎉</h1>
        <p className="text-[var(--color-muted)] mt-2">
          주문번호 <b className="text-[var(--color-ink)]">{order.orderNumber}</b>
        </p>
      </div>

      <div className="rounded-3xl bg-white ring-1 ring-pink-100 p-6 space-y-4">
        {order.items.map((it) => (
          <div key={it.id} className="flex gap-3 items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.product.image} alt={it.product.title} className="w-16 h-16 rounded-xl object-cover" />
            <div className="flex-1">
              <p className="text-sm font-semibold">{it.product.title}</p>
              <p className="text-xs text-[var(--color-muted)]">
                {it.version && `${it.version} · `}수량 {it.quantity}
              </p>
            </div>
            <span className="font-bold text-sm">{won(it.price * it.quantity)}</span>
          </div>
        ))}
        <div className="border-t border-pink-100 pt-4 flex justify-between items-center">
          <span className="font-bold">총 결제금액</span>
          <span className="text-xl font-black text-[var(--color-primary)]">{won(order.total)}</span>
        </div>
        <div className="text-sm text-[var(--color-muted)]">
          <p>받는 분: {order.recipient} ({order.phone})</p>
          <p>주소: {order.address}</p>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Link href="/mypage" className="flex-1 text-center py-3 rounded-xl border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-bold">
          주문 내역 보기
        </Link>
        <Link href="/" className="flex-1 text-center py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold">
          계속 쇼핑하기
        </Link>
      </div>
    </div>
  );
}
