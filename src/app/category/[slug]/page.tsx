import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toCardData } from "@/lib/serialize";
import ProductGrid from "@/components/ProductGrid";
import PageHeader from "@/components/PageHeader";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const items = await prisma.product.findMany({
    where: { categoryId: category.id },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { reviews: true } } },
  });
  const products = items.map(toCardData);

  return (
    <div className="container-x py-8">
      <PageHeader
        title={category.name}
        emoji={category.kind === "goods" ? "🎁" : "💿"}
        subtitle={
          category.kind === "goods"
            ? "최애와 함께하는 굿즈 컬렉션"
            : "정품 K-POP 앨범을 단독 특전과 함께"
        }
        count={products.length}
      />
      <ProductGrid products={products} />
    </div>
  );
}
