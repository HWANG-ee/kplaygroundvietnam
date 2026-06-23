import Link from "next/link";
import { Instagram, Youtube, Twitter, Sparkles } from "lucide-react";
import { getDict } from "@/lib/i18n/server";

export default async function Footer() {
  const { t } = await getDict();
  return (
    <footer className="mt-20 bg-[var(--color-ink)] text-white/80">
      <div className="container-x py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="grid place-items-center w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]">
                <Sparkles size={16} />
              </span>
              <span className="text-xl font-black text-white">K-PLAYGROUND</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed whitespace-pre-line">
              {t.footer.tagline}
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="hover:text-[var(--color-primary)]"><Instagram size={20} /></a>
              <a href="#" className="hover:text-[var(--color-primary)]"><Youtube size={20} /></a>
              <a href="#" className="hover:text-[var(--color-primary)]"><Twitter size={20} /></a>
            </div>
          </div>
          <div>
            <p className="font-bold text-white mb-3">{t.footer.shopping}</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/list/preorder" className="hover:text-white">{t.header.nav.preorder}</Link></li>
              <li><Link href="/list/new" className="hover:text-white">{t.header.nav.new}</Link></li>
              <li><Link href="/list/best" className="hover:text-white">{t.header.nav.best}</Link></li>
              <li><Link href="/list/hotdeal" className="hover:text-white">{t.header.nav.hotdeal}</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-bold text-white mb-3">{t.footer.support}</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/mypage" className="hover:text-white">{t.header.orderLookup}</Link></li>
              <li><a href="#" className="hover:text-white">{t.footer.shipping}</a></li>
              <li><a href="#" className="hover:text-white">{t.footer.returns}</a></li>
              <li><a href="#" className="hover:text-white">{t.footer.faq}</a></li>
            </ul>
          </div>
          <div>
            <p className="font-bold text-white mb-3">{t.footer.csCenter}</p>
            <p className="text-2xl font-black text-white">1670-0000</p>
            <p className="text-sm text-white/60 mt-2 whitespace-pre-line">
              {t.footer.hours}
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-xs text-white/40 leading-relaxed">
          <p>
            (주)케이플레이그라운드 · 대표 홍길동 · 사업자등록번호 000-00-00000 ·
            통신판매업신고 2026-서울강남-00000
          </p>
          <p className="mt-1">
            서울특별시 강남구 케이팝로 42, 3층 · 개인정보보호책임자 김덕질
          </p>
          <p className="mt-3">
            © 2026 K-PLAYGROUND. {t.footer.demoNote}
          </p>
        </div>
      </div>
    </footer>
  );
}
