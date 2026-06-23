import type { Product } from "@prisma/client";
import type { ProductCardData } from "./types";

export function toCardData(
  p: Product & { _count?: { reviews: number } }
): ProductCardData & { hasVersions: boolean } {
  let hasVersions = false;
  try {
    const v = JSON.parse(p.versions);
    hasVersions = Array.isArray(v) && v.length > 0;
  } catch {
    hasVersions = false;
  }
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    artist: p.artist,
    image: p.image,
    price: p.price,
    salePrice: p.salePrice,
    stock: p.stock,
    badge: p.badge,
    reviewCount: p._count?.reviews ?? 0,
    hasVersions,
  };
}
