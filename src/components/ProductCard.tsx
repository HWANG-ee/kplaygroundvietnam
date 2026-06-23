"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Heart, Check } from "lucide-react";
import { useCart } from "@/store/cart";
import { won, discountRate } from "@/lib/format";
import type { ProductCardData } from "@/lib/types";
import { useI18n } from "@/components/i18n/I18nProvider";
import { badgeLabel } from "@/lib/i18n/messages";

const BADGE_STYLE: Record<string, string> = {
  예약: "bg-[var(--color-secondary)] text-white",
  신상: "bg-[var(--color-mint)] text-[var(--color-ink)]",
  베스트: "bg-[var(--color-accent)] text-[var(--color-ink)]",
  핫딜: "bg-[var(--color-primary)] text-white",
  재입고: "bg-[var(--color-sky)] text-white",
};

export default function ProductCard({
  product,
  hasVersions = false,
}: {
  product: ProductCardData;
  hasVersions?: boolean;
}) {
  const add = useCart((s) => s.add);
  const { t } = useI18n();
  const [added, setAdded] = useState(false);
  const [liked, setLiked] = useState(false);
  const rate = discountRate(product.price, product.salePrice);
  const soldOut = product.stock <= 0;

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (soldOut) return;
    add({
      productId: product.id,
      slug: product.slug,
      title: product.title,
      artist: product.artist,
      image: product.image,
      price: product.price,
      salePrice: product.salePrice,
      version: "",
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-pink-100/60">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.badge && (
          <span
            className={`absolute top-2.5 left-2.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${
              BADGE_STYLE[product.badge] || "bg-[var(--color-ink)] text-white"
            }`}
          >
            {badgeLabel(t, product.badge)}
          </span>
        )}
        {soldOut && (
          <div className="absolute inset-0 grid place-items-center bg-black/45">
            <span className="text-white font-bold text-lg">{t.product.soldOut}</span>
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            setLiked((v) => !v);
          }}
          className="absolute top-2 right-2 w-9 h-9 grid place-items-center rounded-full bg-white/90 shadow hover:scale-110 transition"
          aria-label="wishlist"
        >
          <Heart
            size={18}
            className={liked ? "fill-[var(--color-primary)] text-[var(--color-primary)]" : "text-[var(--color-muted)]"}
          />
        </button>

        {!soldOut && (
          <button
            onClick={hasVersions ? undefined : quickAdd}
            className="absolute bottom-2.5 right-2.5 w-11 h-11 grid place-items-center rounded-full bg-[var(--color-primary)] text-white shadow-lg opacity-0 group-hover:opacity-100 transition hover:bg-[var(--color-primary-dark)]"
            aria-label="add to cart"
          >
            {added ? <Check size={20} /> : <ShoppingCart size={20} />}
          </button>
        )}
      </div>

      <div className="pt-3">
        <p className="text-xs text-[var(--color-muted)] font-semibold">
          {product.artist}
        </p>
        <p className="text-sm font-medium line-clamp-2 mt-0.5 min-h-[2.5rem] group-hover:text-[var(--color-primary)]">
          {product.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {rate > 0 && (
            <span className="text-[var(--color-primary)] font-black text-base">
              {rate}%
            </span>
          )}
          <span className="font-black text-base">{won(product.salePrice)}</span>
        </div>
        {rate > 0 && (
          <span className="text-xs text-[var(--color-muted)] line-through">
            {won(product.price)}
          </span>
        )}
        {product.reviewCount !== undefined && product.reviewCount > 0 && (
          <p className="text-[11px] text-[var(--color-muted)] mt-1">
            ⭐ {t.product.review} {product.reviewCount}
          </p>
        )}
      </div>
    </Link>
  );
}
