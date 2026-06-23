export const LOCALES = ["vi", "ko", "en"] as const;
export type Locale = (typeof LOCALES)[number];

// 대상 고객이 베트남이므로 기본 언어는 베트남어. (원하면 "ko"로 변경)
export const DEFAULT_LOCALE: Locale = "vi";

export const LOCALE_COOKIE = "lang";

export const LOCALE_META: Record<Locale, { label: string; flag: string; htmlLang: string }> = {
  vi: { label: "Tiếng Việt", flag: "🇻🇳", htmlLang: "vi" },
  ko: { label: "한국어", flag: "🇰🇷", htmlLang: "ko" },
  en: { label: "English", flag: "🇬🇧", htmlLang: "en" },
};

export function isLocale(v: unknown): v is Locale {
  return typeof v === "string" && (LOCALES as readonly string[]).includes(v);
}
