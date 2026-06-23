import { prisma } from "@/lib/prisma";
import { toCardData } from "@/lib/serialize";
import ProductGrid from "@/components/ProductGrid";
import PageHeader from "@/components/PageHeader";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q || "").trim();

  const items = query
    ? await prisma.product.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { artist: { contains: query } },
            { description: { contains: query } },
          ],
        },
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { reviews: true } } },
      })
    : [];
  const products = items.map(toCardData);

  return (
    <div className="container-x py-8">
      <PageHeader
        title={query ? `"${query}" 검색 결과` : "검색"}
        emoji="🔍"
        subtitle={query ? undefined : "찾으시는 아티스트나 상품을 검색해보세요"}
        count={query ? products.length : undefined}
      />
      {query && <ProductGrid products={products} />}
    </div>
  );
}
