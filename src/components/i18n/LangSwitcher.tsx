"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Globe, Check, ChevronDown } from "lucide-react";
import { LOCALES, LOCALE_COOKIE, LOCALE_META, type Locale } from "@/lib/i18n/config";
import { useI18n } from "./I18nProvider";

export default function LangSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale } = useI18n();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function choose(next: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    setOpen(false);
    // 쿠키 기반이므로 서버 컴포넌트를 다시 렌더 + 클라이언트 갱신
    router.refresh();
  }

  const meta = LOCALE_META[locale];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 rounded-full hover:bg-pink-50 text-[var(--color-ink)] ${
          compact ? "px-2 py-1" : "px-2.5 py-1"
        }`}
        aria-label="language"
      >
        <Globe size={compact ? 14 : 15} className="text-[var(--color-muted)]" />
        <span className="text-sm">{meta.flag}</span>
        {!compact && <span className="text-[11px] font-semibold">{meta.htmlLang.toUpperCase()}</span>}
        <ChevronDown size={12} className="text-[var(--color-muted)]" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-xl border border-pink-100 p-1 z-50">
          {LOCALES.map((l) => {
            const m = LOCALE_META[l];
            const active = l === locale;
            return (
              <button
                key={l}
                onClick={() => choose(l)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-pink-50 ${
                  active ? "font-bold text-[var(--color-primary)]" : "text-[var(--color-ink)]"
                }`}
              >
                <span className="text-base">{m.flag}</span>
                <span className="flex-1 text-left">{m.label}</span>
                {active && <Check size={15} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
