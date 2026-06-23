import ProductCard from "./ProductCard";
import type { ProductCardData } from "@/lib/types";

type Item = ProductCardData & { hasVersions?: boolean };

export default function ProductGrid({ products }: { products: Item[] }) {
  if (!products.length) {
    return (
      <div className="py-20 text-center text-[var(--color-muted)]">
        상품이 없습니다 🥲
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} hasVersions={p.hasVersions} />
      ))}
    </div>
  );
}
