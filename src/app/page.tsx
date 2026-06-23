import { prisma } from "@/lib/prisma";
import { toCardData } from "@/lib/serialize";
import Hero from "@/components/Hero";
import CategoryStrip from "@/components/CategoryStrip";
import Section from "@/components/Section";
import { getDict } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

async function getProducts(where: object, take = 5) {
  const items = await prisma.product.findMany({
    where,
    take,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { reviews: true } } },
  });
  return items.map(toCardData);
}

export default async function Home() {
  const [{ t }, [preorder, fresh, best, hotdeal, restock]] = await Promise.all([
    getDict(),
    Promise.all([
      getProducts({ isPreorder: true }),
      getProducts({ isNew: true }),
      getProducts({ isBest: true }),
      getProducts({ isHotDeal: true }),
      getProducts({ isRestocked: true }),
    ]),
  ]);
  const s = t.home.sections;

  return (
    <div className="container-x">
      <Hero />
      <CategoryStrip />

      <Section
        title={s.preorder.title}
        emoji="📦"
        subtitle={s.preorder.subtitle}
        href="/list/preorder"
        products={preorder}
        accent="var(--color-secondary)"
      />
      <Section
        title={s.new.title}
        emoji="✨"
        subtitle={s.new.subtitle}
        href="/list/new"
        products={fresh}
        accent="var(--color-mint)"
      />

      {/* promo band */}
      <div className="my-6 rounded-3xl bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)] text-white px-8 py-7 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-xl md:text-2xl font-black">{t.home.promoTitle}</p>
          <p className="text-white/80 text-sm mt-1">{t.home.promoSub}</p>
        </div>
        <a
          href="/signup"
          className="bg-white text-[var(--color-primary)] font-bold px-6 py-3 rounded-full whitespace-nowrap"
        >
          {t.home.promoCta}
        </a>
      </div>

      <Section
        title={s.best.title}
        emoji="🏆"
        subtitle={s.best.subtitle}
        href="/list/best"
        products={best}
        accent="var(--color-accent)"
      />
      <Section
        title={s.hotdeal.title}
        emoji="🔥"
        subtitle={s.hotdeal.subtitle}
        href="/list/hotdeal"
        products={hotdeal}
        accent="var(--color-primary)"
      />
      <Section
        title={s.restock.title}
        emoji="🔄"
        subtitle={s.restock.subtitle}
        href="/list/restock"
        products={restock}
        accent="var(--color-sky)"
      />
    </div>
  );
}
