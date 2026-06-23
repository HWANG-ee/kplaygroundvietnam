import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import type { ProductCardData } from "@/lib/types";
import { getDict } from "@/lib/i18n/server";

type Item = ProductCardData & { hasVersions?: boolean };

export default async function Section({
  title,
  emoji,
  subtitle,
  href,
  products,
  accent = "var(--color-primary)",
}: {
  title: string;
  emoji: string;
  subtitle?: string;
  href: string;
  products: Item[];
  accent?: string;
}) {
  if (!products.length) return null;
  const { t } = await getDict();
  return (
    <section className="py-8">
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2">
            <span style={{ color: accent }}>{emoji}</span>
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-[var(--color-muted)] mt-1">{subtitle}</p>
          )}
        </div>
        <Link
          href={href}
          className="text-sm font-semibold text-[var(--color-muted)] hover:text-[var(--color-primary)] flex items-center"
        >
          {t.product.viewAll} <ChevronRight size={16} />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-8">
        {products.slice(0, 5).map((p) => (
          <ProductCard key={p.id} product={p} hasVersions={p.hasVersions} />
        ))}
      </div>
    </section>
  );
}
