"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { won } from "@/lib/format";

type Row = {
  id: string;
  slug: string;
  title: string;
  artist: string;
  image: string;
  price: number;
  salePrice: number;
  stock: number;
  badge: string;
  category: string;
};

export default function AdminProductTable({
  products,
  categories,
}: {
  products: Row[];
  categories: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [filter, setFilter] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  async function del(id: string, title: string) {
    if (!confirm(`"${title}" 상품을 삭제할까요?`)) return;
    setBusy(id);
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setBusy(null);
    if (!res.ok) {
      const d = await res.json();
      alert(d.error || "삭제 실패");
      return;
    }
    router.refresh();
  }

  const rows = filter
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(filter.toLowerCase()) ||
          p.artist.toLowerCase().includes(filter.toLowerCase())
      )
    : products;

  return (
    <div>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="상품명 / 아티스트 검색"
        className="mb-4 w-full max-w-sm px-4 py-2.5 rounded-xl border border-pink-100 focus:border-[var(--color-primary)] outline-none"
      />
      <div className="rounded-2xl bg-white ring-1 ring-pink-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-pink-50 text-left text-[var(--color-muted)]">
              <tr>
                <th className="px-4 py-3 font-semibold">상품</th>
                <th className="px-4 py-3 font-semibold">카테고리</th>
                <th className="px-4 py-3 font-semibold">판매가</th>
                <th className="px-4 py-3 font-semibold">재고</th>
                <th className="px-4 py-3 font-semibold text-right">관리</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-t border-pink-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-semibold line-clamp-1">{p.title}</p>
                        <p className="text-xs text-[var(--color-muted)]">{p.artist}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-muted)]">{p.category}</td>
                  <td className="px-4 py-3 font-semibold">{won(p.salePrice)}</td>
                  <td className="px-4 py-3">
                    <span className={p.stock <= 0 ? "text-[var(--color-primary)] font-bold" : ""}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="p-2 rounded-lg hover:bg-pink-50 text-[var(--color-secondary)]"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => del(p.id, p.title)}
                        disabled={busy === p.id}
                        className="p-2 rounded-lg hover:bg-pink-50 text-[var(--color-primary)] disabled:opacity-40"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-[var(--color-muted)]">
                    상품이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-[var(--color-muted)] mt-2">{rows.length}개 / 전체 {products.length}개</p>
      {categories.length === 0 && (
        <p className="text-xs text-[var(--color-primary)] mt-1">카테고리가 없습니다.</p>
      )}
    </div>
  );
}
