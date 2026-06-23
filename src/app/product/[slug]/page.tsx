import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { toCardData } from "@/lib/serialize";
import { won, discountRate, parseJsonArray } from "@/lib/format";
import AddToCart from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";
import { Truck, ShieldCheck, Gift } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!product) notFound();

  const versions = parseJsonArray(product.versions);
  const gallery = [product.image, ...parseJsonArray(product.images)];
  const rate = discountRate(product.price, product.salePrice);

  const related = (
    await prisma.product.findMany({
      where: { categoryId: product.categoryId, NOT: { id: product.id } },
      take: 5,
      include: { _count: { select: { reviews: true } } },
    })
  ).map(toCardData);

  const avgRating =
    product.reviews.length > 0
      ? (
          product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="container-x py-8">
      {/* breadcrumb */}
      <nav className="text-xs text-[var(--color-muted)] mb-5">
        <Link href="/" className="hover:text-[var(--color-primary)]">홈</Link>
        {" / "}
        <Link href={`/category/${product.category.slug}`} className="hover:text-[var(--color-primary)]">
          {product.category.name}
        </Link>
        {" / "}
        <span className="text-[var(--color-ink)]">{product.title}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* gallery */}
        <div>
          <div className="aspect-square rounded-3xl overflow-hidden ring-1 ring-pink-100 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={gallery[0]} alt={product.title} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-3 mt-3">
            {gallery.slice(0, 4).map((g, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={g}
                alt=""
                className="aspect-square rounded-xl object-cover ring-1 ring-pink-100"
              />
            ))}
          </div>
        </div>

        {/* info */}
        <div>
          {product.badge && (
            <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-[var(--color-primary)] text-white mb-3">
              {product.badge}
            </span>
          )}
          <p className="text-sm font-semibold text-[var(--color-secondary)]">
            {product.artist}
          </p>
          <h1 className="text-2xl md:text-3xl font-black mt-1">{product.title}</h1>

          {avgRating && (
            <p className="text-sm text-[var(--color-muted)] mt-2">
              ⭐ {avgRating} · 리뷰 {product.reviews.length}개
            </p>
          )}

          <div className="mt-5 flex items-end gap-3">
            {rate > 0 && (
              <span className="text-3xl font-black text-[var(--color-primary)]">{rate}%</span>
            )}
            <span className="text-3xl font-black">{won(product.salePrice)}</span>
            {rate > 0 && (
              <span className="text-lg text-[var(--color-muted)] line-through mb-1">
                {won(product.price)}
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-[var(--color-muted)]">
            <span>적립 마일리지 <b className="text-[var(--color-ink)]">{Math.floor(product.salePrice * 0.01).toLocaleString()}P</b></span>
            <span>배송비 <b className="text-[var(--color-ink)]">3,000원</b> (5만원 이상 무료)</span>
          </div>

          <div className="my-6 border-t border-pink-100" />

          <AddToCart
            product={{
              id: product.id,
              slug: product.slug,
              title: product.title,
              artist: product.artist,
              image: product.image,
              price: product.price,
              salePrice: product.salePrice,
              stock: product.stock,
              versions,
            }}
          />

          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs">
            <div className="rounded-2xl bg-white ring-1 ring-pink-100 py-4">
              <Truck className="mx-auto text-[var(--color-primary)]" size={22} />
              <p className="mt-2 font-semibold">당일 발송</p>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-pink-100 py-4">
              <Gift className="mx-auto text-[var(--color-secondary)]" size={22} />
              <p className="mt-2 font-semibold">단독 특전</p>
            </div>
            <div className="rounded-2xl bg-white ring-1 ring-pink-100 py-4">
              <ShieldCheck className="mx-auto text-[var(--color-mint)]" size={22} />
              <p className="mt-2 font-semibold">정품 보장</p>
            </div>
          </div>
        </div>
      </div>

      {/* description */}
      <div className="mt-14 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-black mb-4">📝 상품 상세</h2>
          <div className="rounded-3xl bg-white ring-1 ring-pink-100 p-7 leading-relaxed text-[var(--color-ink)]/80">
            {product.description}
            <div className="mt-6 rounded-2xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={gallery[1] || gallery[0]} alt="" className="w-full" />
            </div>
          </div>

          {/* reviews */}
          <h2 className="text-xl font-black mt-12 mb-4">
            💬 리뷰 <span className="text-[var(--color-muted)] text-base">{product.reviews.length}</span>
          </h2>
          <div className="space-y-3">
            {product.reviews.length === 0 && (
              <p className="text-sm text-[var(--color-muted)] py-8 text-center bg-white rounded-2xl ring-1 ring-pink-100">
                아직 리뷰가 없어요. 첫 리뷰를 남겨보세요!
              </p>
            )}
            {product.reviews.map((r) => (
              <div key={r.id} className="rounded-2xl bg-white ring-1 ring-pink-100 p-5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm">{r.user.name}</span>
                  <span className="text-[var(--color-accent)]">{"★".repeat(r.rating)}</span>
                </div>
                <p className="text-sm text-[var(--color-ink)]/80 mt-2">{r.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* sticky info */}
        <div>
          <div className="rounded-3xl bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 p-6 sticky top-40">
            <h3 className="font-black mb-3">🚚 배송 안내</h3>
            <ul className="text-sm text-[var(--color-ink)]/70 space-y-2">
              <li>· 평일 14시 이전 주문 시 당일 발송</li>
              <li>· 5만원 이상 구매 시 무료배송</li>
              <li>· 예약상품은 발매일에 맞춰 순차 발송</li>
              <li>· 단독 특전은 한정 수량 소진 시 마감</li>
            </ul>
          </div>
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-black mb-5">🛍️ 함께 보면 좋은 상품</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-8">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} hasVersions={p.hasVersions} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
