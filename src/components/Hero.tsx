import Link from "next/link";
import fs from "fs";
import path from "path";
import { getDict } from "@/lib/i18n/server";
import { getSiteSettings } from "@/lib/settings";

export default async function Hero() {
  const [{ t }, s] = await Promise.all([getDict(), getSiteSettings()]);

  // 메인 배너 배경: 설정 이미지 URL 우선, 없으면 public/hero-bg.jpg 파일
  const hasHeroFile = fs.existsSync(path.join(process.cwd(), "public", "hero-bg.jpg"));
  const mainBg = s.heroMainImage.trim() || (hasHeroFile ? "/hero-bg.jpg" : "");
  const hotBg = s.heroHotImage.trim();
  const goodsBg = s.heroGoodsImage.trim();

  return (
    <section className="py-6">
      <div className="grid lg:grid-cols-3 gap-4">
        {/* main banner */}
        <Link
          href="/list/preorder"
          className="lg:col-span-2 relative overflow-hidden rounded-3xl p-8 md:p-12 min-h-[280px] flex flex-col justify-center bg-gradient-to-br from-[var(--color-primary)] via-[#ff6fb5] to-[var(--color-secondary)] text-white"
        >
          {/* 배경 사진 (투명도 30%) */}
          {mainBg && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mainBg}
              alt=""
              aria-hidden
              className="absolute inset-0 w-full h-full object-cover object-[center_22%] opacity-30 z-0 pointer-events-none"
            />
          )}
          <div className="absolute -right-10 -top-10 w-56 h-56 rounded-full bg-white/15 animate-bob z-0" />
          <div className="absolute right-16 bottom-6 w-24 h-24 rounded-full bg-[var(--color-accent)]/40 z-0" />
          <div className="relative z-10 flex flex-col">
            <span className="inline-block w-fit text-xs font-bold bg-white/25 px-3 py-1 rounded-full mb-3">
              {t.hero.badge}
            </span>
            <h1 className="text-3xl md:text-5xl font-black leading-tight drop-shadow">
              {t.hero.title}<br />
              {t.hero.titleTail}
            </h1>
            <p className="mt-3 text-white/90 md:text-lg drop-shadow">
              {t.hero.subtitle}
            </p>
            <span className="mt-5 w-fit bg-white text-[var(--color-primary)] font-bold px-6 py-3 rounded-full">
              {t.hero.cta}
            </span>
          </div>
        </Link>

        {/* side banners */}
        <div className="grid grid-rows-2 gap-4">
          <Link
            href="/list/hotdeal"
            className={`relative overflow-hidden rounded-3xl p-6 flex flex-col justify-center ${
              hotBg ? "text-white" : "bg-gradient-to-br from-[var(--color-accent)] to-[#ff9a3d] text-[var(--color-ink)]"
            }`}
          >
            {hotBg && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={hotBg} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover z-0" />
                <div className="absolute inset-0 bg-black/40 z-0" />
              </>
            )}
            <div className="relative z-10">
              <span className="text-xs font-bold">{t.hero.hotKicker}</span>
              <p className="text-2xl font-black mt-1 drop-shadow">{t.hero.hotTitle}</p>
              <p className="text-sm mt-1 drop-shadow">{t.hero.hotSub}</p>
            </div>
          </Link>
          <Link
            href="/category/lightstick"
            className={`relative overflow-hidden rounded-3xl p-6 flex flex-col justify-center text-white ${
              goodsBg ? "" : "bg-gradient-to-br from-[var(--color-mint)] to-[var(--color-sky)]"
            }`}
          >
            {goodsBg && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={goodsBg} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover z-0" />
                <div className="absolute inset-0 bg-black/40 z-0" />
              </>
            )}
            <div className="relative z-10">
              <span className="text-xs font-bold">{t.hero.goodsKicker}</span>
              <p className="text-2xl font-black mt-1 drop-shadow">{t.hero.goodsTitle}</p>
              <p className="text-sm mt-1 drop-shadow">{t.hero.goodsSub}</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
