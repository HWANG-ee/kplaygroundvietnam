"use client";

import { createContext, useContext } from "react";
import type { Locale } from "@/lib/i18n/config";
import { fmt, type Messages } from "@/lib/i18n/messages";

type Ctx = {
  locale: Locale;
  t: Messages;
  fmt: typeof fmt;
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale;
  messages: Messages;
  children: React.ReactNode;
}) {
  return (
    <I18nContext.Provider value={{ locale, t: messages, fmt }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
