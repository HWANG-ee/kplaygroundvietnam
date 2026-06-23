"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/store/cart";
import { useEffect } from "react";
import { useI18n } from "@/components/i18n/I18nProvider";
import LangSwitcher from "@/components/i18n/LangSwitcher";
import { categoryName, type Messages } from "@/lib/i18n/messages";

type Cat = { slug: string; name: string; kind: string };
type SessionUser = { id: string; name: string; role: string } | null;

type QuickItem = { href: string; key: keyof Messages["header"]["nav"]; hot?: boolean };
const QUICK: QuickItem[] = [
  { href: "/list/preorder", key: "preorder", hot: true },
  { href: "/list/new", key: "new" },
  { href: "/list/best", key: "best" },
  { href: "/list/hotdeal", key: "hotdeal", hot: true },
  { href: "/list/restock", key: "restock" },
];

const TRENDING = ["AURORA", "응원봉", "포토카드", "시즌그리팅", "핫딜"];

export default function Header({
  user,
  categories,
}: {
  user: SessionUser;
  categories: Cat[];
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const count = useCart((s) => s.count());
  const { t, fmt } = useI18n();

  useEffect(() => setMounted(true), []);

  const albums = categories.filter((c) => c.kind === "album");
  const goods = categories.filter((c) => c.kind === "goods");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <header className="sticky top-0 z-50">
      {/* announcement marquee */}
      <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white text-xs py-1.5 overflow-hidden whitespace-nowrap">
        <div className="animate-marquee inline-block">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="mx-6">
              {t.header.announce}
            </span>
          ))}
        </div>
      </div>

      <div className="backdrop-blur bg-white/80 border-b border-pink-100">
        <div className="container-x">
          {/* top utility */}
          <div className="flex justify-end items-center gap-4 text-[11px] text-[var(--color-muted)] py-1.5">
            {user ? (
              <>
                <span className="font-semibold text-[var(--color-ink)]">
                  {fmt(t.header.hello, { name: user.name })}
                </span>
                {(user.role === "admin" || user.role === "manager") && (
                  <Link href="/admin" className="hover:text-[var(--color-primary)] font-semibold text-[var(--color-primary)]">
                    {user.role === "admin" ? t.header.admin : t.header.manager}
                  </Link>
                )}
                <Link href="/mypage" className="hover:text-[var(--color-primary)]">
                  {t.header.mypage}
                </Link>
                <form action="/api/auth/logout" method="post">
                  <button className="hover:text-[var(--color-primary)]">{t.header.logout}</button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-[var(--color-primary)]">
                  {t.header.login}
                </Link>
                <Link href="/signup" className="hover:text-[var(--color-primary)]">
                  {t.header.signup}
                </Link>
              </>
            )}
            <Link href="/mypage" className="hover:text-[var(--color-primary)]">
              {t.header.orderLookup}
            </Link>
            <span className="hidden sm:inline text-pink-200">{t.header.cs}</span>
            <LangSwitcher />
          </div>

          {/* main bar */}
          <div className="flex items-center gap-4 py-3">
            <button
              className="md:hidden p-2"
              onClick={() => setOpen(true)}
              aria-label="menu"
            >
              <Menu size={24} />
            </button>

            <Link href="/" className="flex items-center gap-2 shrink-0">
              <span className="grid place-items-center w-9 h-9 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white animate-bob">
                <Sparkles size={18} />
              </span>
              <span className="text-2xl font-black tracking-tight">
                <span className="text-gradient">K-PLAY</span>
                <span className="text-[var(--color-ink)]">GROUND</span>
              </span>
            </Link>

            {/* search */}
            <form
              onSubmit={submit}
              className="hidden md:flex flex-1 max-w-xl mx-auto"
            >
              <div className="flex w-full items-center rounded-full border-2 border-[var(--color-primary)] bg-white overflow-hidden">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t.header.searchPlaceholder}
                  className="flex-1 px-5 py-2.5 outline-none text-sm bg-transparent"
                />
                <button
                  className="px-5 text-[var(--color-primary)]"
                  aria-label="search"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>

            {/* actions */}
            <div className="flex items-center gap-1 ml-auto md:ml-0">
              <Link
                href="/mypage?tab=wishlist"
                className="p-2 rounded-full hover:bg-pink-50 text-[var(--color-ink)]"
                aria-label="wishlist"
              >
                <Heart size={22} />
              </Link>
              <Link
                href={user ? "/mypage" : "/login"}
                className="p-2 rounded-full hover:bg-pink-50 text-[var(--color-ink)]"
                aria-label="account"
              >
                <User size={22} />
              </Link>
              <Link
                href="/cart"
                className="relative p-2 rounded-full hover:bg-pink-50 text-[var(--color-ink)]"
                aria-label="cart"
              >
                <ShoppingCart size={22} />
                {mounted && count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 grid place-items-center text-[10px] font-bold text-white bg-[var(--color-primary)] rounded-full">
                    {count}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* mobile search */}
          <form onSubmit={submit} className="md:hidden pb-3">
            <div className="flex w-full items-center rounded-full border-2 border-[var(--color-primary)] bg-white overflow-hidden">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t.header.searchShort}
                className="flex-1 px-4 py-2 outline-none text-sm bg-transparent"
              />
              <button className="px-4 text-[var(--color-primary)]" aria-label="search">
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* nav */}
          <nav className="hidden md:flex items-center gap-1 pb-2 text-sm font-semibold">
            <CategoryMenu albums={albums} goods={goods} />
            {QUICK.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className={`px-3 py-1.5 rounded-full hover:bg-pink-50 ${
                  it.hot ? "text-[var(--color-primary)]" : "text-[var(--color-ink)]"
                }`}
              >
                {t.header.nav[it.key]}
                {it.hot && " 🔥"}
              </Link>
            ))}
            <span className="ml-auto text-[11px] font-normal text-[var(--color-muted)] flex items-center gap-2">
              {t.header.trending}
              {TRENDING.map((t) => (
                <Link
                  key={t}
                  href={`/search?q=${encodeURIComponent(t)}`}
                  className="hover:text-[var(--color-primary)]"
                >
                  #{t}
                </Link>
              ))}
            </span>
          </nav>
        </div>
      </div>

      {/* mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-white p-5 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl font-black text-gradient">K-PLAYGROUND</span>
              <button onClick={() => setOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="space-y-1 mb-6">
              {QUICK.map((it) => (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 font-semibold"
                >
                  {t.header.nav[it.key]}
                </Link>
              ))}
            </div>
            <p className="text-xs text-[var(--color-muted)] mb-2">{t.header.albums}</p>
            <div className="space-y-1 mb-4">
              {albums.map((c) => (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  onClick={() => setOpen(false)}
                  className="block py-1.5 text-sm"
                >
                  {categoryName(t, c.slug, c.name)}
                </Link>
              ))}
            </div>
            <p className="text-xs text-[var(--color-muted)] mb-2">{t.header.goods}</p>
            <div className="space-y-1">
              {goods.map((c) => (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  onClick={() => setOpen(false)}
                  className="block py-1.5 text-sm"
                >
                  {categoryName(t, c.slug, c.name)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function CategoryMenu({ albums, goods }: { albums: Cat[]; goods: Cat[] }) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="px-3 py-1.5 rounded-full bg-[var(--color-ink)] text-white flex items-center gap-1.5">
        <Menu size={16} /> {t.header.category}
      </button>
      {open && (
        <div className="absolute left-0 top-full pt-2 w-[420px] z-50">
          <div className="bg-white rounded-2xl shadow-xl border border-pink-100 p-5 grid grid-cols-2 gap-5">
            <div>
              <p className="text-xs font-bold text-[var(--color-primary)] mb-2">
                💿 {t.header.albums}
              </p>
              <div className="space-y-1.5">
                {albums.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/category/${c.slug}`}
                    className="block text-sm hover:text-[var(--color-primary)]"
                  >
                    {categoryName(t, c.slug, c.name)}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--color-secondary)] mb-2">
                🎁 {t.header.goods}
              </p>
              <div className="space-y-1.5">
                {goods.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/category/${c.slug}`}
                    className="block text-sm hover:text-[var(--color-secondary)]"
                  >
                    {categoryName(t, c.slug, c.name)}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
