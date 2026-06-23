"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Heart, Check } from "lucide-react";
import { useCart } from "@/store/cart";
import { won } from "@/lib/format";
import type { CartItem } from "@/lib/types";

type Props = {
  product: {
    id: string;
    slug: string;
    title: string;
    artist: string;
    image: string;
    price: number;
    salePrice: number;
    stock: number;
    versions: string[];
  };
};

export default function AddToCart({ product }: Props) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const [version, setVersion] = useState(product.versions[0] || "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false);
  const soldOut = product.stock <= 0;

  function build(): CartItem {
    return {
      productId: product.id,
      slug: product.slug,
      title: product.title,
      artist: product.artist,
      image: product.image,
      price: product.price,
      salePrice: product.salePrice,
      version,
      quantity: qty,
    };
  }

  function addToCart() {
    if (soldOut) return;
    add(build());
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  function buyNow() {
    if (soldOut) return;
    add(build());
    router.push("/cart");
  }

  return (
    <div className="space-y-5">
      {product.versions.length > 0 && (
        <div>
          <p className="text-sm font-semibold mb-2">버전 선택</p>
          <div className="flex flex-wrap gap-2">
            {product.versions.map((v) => (
              <button
                key={v}
                onClick={() => setVersion(v)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition ${
                  version === v
                    ? "border-[var(--color-primary)] bg-pink-50 text-[var(--color-primary)]"
                    : "border-pink-100 text-[var(--color-ink)] hover:border-[var(--color-primary)]/50"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">수량</p>
        <div className="flex items-center border-2 border-pink-100 rounded-xl overflow-hidden">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-2 hover:bg-pink-50"
          >
            <Minus size={16} />
          </button>
          <span className="w-12 text-center font-bold">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            className="px-3 py-2 hover:bg-pink-50"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-pink-50 px-5 py-4">
        <span className="font-semibold">총 상품금액</span>
        <span className="text-2xl font-black text-[var(--color-primary)]">
          {won(product.salePrice * qty)}
        </span>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => setLiked((v) => !v)}
          className="w-14 shrink-0 grid place-items-center rounded-xl border-2 border-pink-100 hover:border-[var(--color-primary)]"
          aria-label="wishlist"
        >
          <Heart
            size={22}
            className={liked ? "fill-[var(--color-primary)] text-[var(--color-primary)]" : "text-[var(--color-muted)]"}
          />
        </button>
        <button
          onClick={addToCart}
          disabled={soldOut}
          className="flex-1 py-3.5 rounded-xl border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-bold flex items-center justify-center gap-2 hover:bg-pink-50 disabled:opacity-50"
        >
          {added ? <Check size={20} /> : <ShoppingCart size={20} />}
          {added ? "담겼어요!" : "장바구니"}
        </button>
        <button
          onClick={buyNow}
          disabled={soldOut}
          className="flex-1 py-3.5 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:bg-[var(--color-primary-dark)] disabled:opacity-50"
        >
          {soldOut ? "품절" : "바로구매"}
        </button>
      </div>
    </div>
  );
}
