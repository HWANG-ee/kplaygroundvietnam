"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/store/cart";
import { won } from "@/lib/format";
import { useEffect, useState } from "react";

const SHIPPING = 3000;
const FREE_OVER = 50000;

export default function CartPage() {
  const router = useRouter();
  const { items, setQty, remove, subtotal } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="container-x py-20" />;

  const sub = subtotal();
  const shipping = sub === 0 || sub >= FREE_OVER ? 0 : SHIPPING;
  const total = sub + shipping;

  if (items.length === 0) {
    return (
      <div className="container-x py-24 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-black">장바구니가 비어있어요</h1>
        <p className="text-[var(--color-muted)] mt-2">최애의 앨범과 굿즈를 담아보세요!</p>
        <Link
          href="/"
          className="inline-block mt-6 px-7 py-3 rounded-full bg-[var(--color-primary)] text-white font-bold"
        >
          쇼핑하러 가기
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x py-8">
      <h1 className="text-3xl font-black mb-8">🛒 장바구니</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((it) => (
            <div
              key={`${it.productId}-${it.version}`}
              className="flex gap-4 rounded-2xl bg-white ring-1 ring-pink-100 p-4"
            >
              <Link href={`/product/${it.slug}`} className="shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.image} alt={it.title} className="w-24 h-24 rounded-xl object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-[var(--color-muted)] font-semibold">{it.artist}</p>
                    <Link href={`/product/${it.slug}`} className="font-semibold line-clamp-1 hover:text-[var(--color-primary)]">
                      {it.title}
                    </Link>
                    {it.version && (
                      <p className="text-xs text-[var(--color-muted)] mt-0.5">옵션: {it.version}</p>
                    )}
                  </div>
                  <button
                    onClick={() => remove(it.productId, it.version)}
                    className="text-[var(--color-muted)] hover:text-[var(--color-primary)] h-fit"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="flex items-end justify-between mt-3">
                  <div className="flex items-center border-2 border-pink-100 rounded-lg overflow-hidden">
                    <button onClick={() => setQty(it.productId, it.version, it.quantity - 1)} className="px-2.5 py-1.5 hover:bg-pink-50">
                      <Minus size={14} />
                    </button>
                    <span className="w-9 text-center text-sm font-bold">{it.quantity}</span>
                    <button onClick={() => setQty(it.productId, it.version, it.quantity + 1)} className="px-2.5 py-1.5 hover:bg-pink-50">
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="font-black">{won(it.salePrice * it.quantity)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* summary */}
        <div>
          <div className="rounded-3xl bg-white ring-1 ring-pink-100 p-6 sticky top-40">
            <h2 className="font-black text-lg mb-4">결제 예상 금액</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">상품금액</span>
                <span className="font-semibold">{won(sub)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--color-muted)]">배송비</span>
                <span className="font-semibold">{shipping === 0 ? "무료" : won(shipping)}</span>
              </div>
              {sub < FREE_OVER && sub > 0 && (
                <p className="text-xs text-[var(--color-primary)]">
                  {won(FREE_OVER - sub)} 더 담으면 무료배송!
                </p>
              )}
            </div>
            <div className="border-t border-pink-100 my-4" />
            <div className="flex justify-between items-center mb-5">
              <span className="font-bold">총 결제금액</span>
              <span className="text-2xl font-black text-[var(--color-primary)]">{won(total)}</span>
            </div>
            <button
              onClick={() => router.push("/checkout")}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:bg-[var(--color-primary-dark)]"
            >
              <ShoppingBag size={20} /> 주문하기
            </button>
            <Link href="/" className="block text-center text-sm text-[var(--color-muted)] mt-3 hover:text-[var(--color-primary)]">
              계속 쇼핑하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
