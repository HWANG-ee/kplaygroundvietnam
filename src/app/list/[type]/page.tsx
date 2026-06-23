import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toCardData } from "@/lib/serialize";
import ProductGrid from "@/components/ProductGrid";
import PageHeader from "@/components/PageHeader";

export const dynamic = "force-dynamic";

const MAP: Record<
  string,
  { title: string; emoji: string; subtitle: string; where: object }
> = {
  preorder: {
    title: "예약판매",
    emoji: "📦",
    subtitle: "지금 예약하면 단독 특전까지 챙겨드려요!",
    where: { isPreorder: true },
  },
  new: {
    title: "신상품",
    emoji: "✨",
    subtitle: "따끈따끈 방금 입고된 신상을 만나보세요",
    where: { isNew: true },
  },
  best: {
    title: "베스트",
    emoji: "🏆",
    subtitle: "지금 가장 사랑받는 상품 모음",
    where: { isBest: true },
  },
  hotdeal: {
    title: "핫딜",
    emoji: "🔥",
    subtitle: "놓치면 후회하는 한정 특가",
    where: { isHotDeal: true },
  },
  restock: {
    title: "재입고",
    emoji: "🔄",
    subtitle: "기다리던 그 상품이 돌아왔어요",
    where: { isRestocked: true },
  },
};

export default async function ListPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const conf = MAP[type];
  if (!conf) notFound();

  const items = await prisma.product.findMany({
    where: conf.where,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { reviews: true } } },
  });
  const products = items.map(toCardData);

  return (
    <div className="container-x py-8">
      <PageHeader
        title={conf.title}
        emoji={conf.emoji}
        subtitle={conf.subtitle}
        count={products.length}
      />
      <ProductGrid products={products} />
    </div>
  );
}
