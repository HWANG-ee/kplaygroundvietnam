import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/lib/i18n/server";
import { LOCALE_META } from "@/lib/i18n/config";
import { MESSAGES } from "@/lib/i18n/messages";
import { I18nProvider } from "@/components/i18n/I18nProvider";

export const metadata: Metadata = {
  title: "K-PLAYGROUND · 케이플레이그라운드 | K-POP 앨범 & 굿즈샵",
  description:
    "최애를 위한 모든 것. K-POP 앨범, 응원봉, 포토카드, 굿즈를 가장 빠르게. 예약판매·핫딜·단독 특전까지!",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, categories, locale] = await Promise.all([
    getCurrentUser(),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
    getLocale(),
  ]);

  return (
    <html lang={LOCALE_META[locale].htmlLang}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body>
        <I18nProvider locale={locale} messages={MESSAGES[locale]}>
          <Header user={user} categories={categories} />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
