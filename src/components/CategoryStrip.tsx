import Link from "next/link";
import { prisma } from "@/lib/prisma";

// slug별 아이콘(이모지). 관리자가 추가한 새 카테고리는 기본 아이콘 사용.
const EMOJI: Record<string, string> = {
  "kpop-album": "💿",
  ost: "🎬",
  vinyl: "🎵",
  season: "📅",
  lightstick: "🔦",
  photocard: "🎴",
  apparel: "👕",
  stationery: "📔",
};

export default async function CategoryStrip() {
  const cats = await prisma.category.findMany({ orderBy: { order: "asc" }, take: 8 });
  if (cats.length === 0) return null;

  return (
    <section className="py-4">
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {cats.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className="flex flex-col items-center gap-2 group"
          >
            <span className="w-16 h-16 grid place-items-center text-3xl rounded-2xl bg-white shadow-sm ring-1 ring-pink-100 group-hover:-translate-y-1 group-hover:ring-[var(--color-primary)] transition">
              {EMOJI[c.slug] || (c.kind === "goods" ? "🛍️" : "🎵")}
            </span>
            <span className="text-xs font-semibold text-center line-clamp-2">{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
