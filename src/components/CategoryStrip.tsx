import Link from "next/link";
import { getDict } from "@/lib/i18n/server";
import { categoryName } from "@/lib/i18n/messages";

const ITEMS = [
  { slug: "kpop-album", name: "K-POP 앨범", emoji: "💿" },
  { slug: "ost", name: "OST", emoji: "🎬" },
  { slug: "vinyl", name: "LP/바이닐", emoji: "🎵" },
  { slug: "season", name: "시즌그리팅", emoji: "📅" },
  { slug: "lightstick", name: "응원봉", emoji: "🔦" },
  { slug: "photocard", name: "포토카드", emoji: "🎴" },
  { slug: "apparel", name: "의류", emoji: "👕" },
  { slug: "stationery", name: "문구/리빙", emoji: "📔" },
];

export default async function CategoryStrip() {
  const { t } = await getDict();
  return (
    <section className="py-4">
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {ITEMS.map((it) => (
          <Link
            key={it.slug}
            href={`/category/${it.slug}`}
            className="flex flex-col items-center gap-2 group"
          >
            <span className="w-16 h-16 grid place-items-center text-3xl rounded-2xl bg-white shadow-sm ring-1 ring-pink-100 group-hover:-translate-y-1 group-hover:ring-[var(--color-primary)] transition">
              {it.emoji}
            </span>
            <span className="text-xs font-semibold text-center">
              {categoryName(t, it.slug, it.name)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
