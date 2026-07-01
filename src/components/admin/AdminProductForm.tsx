"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Category = { id: string; name: string };
type Initial = {
  id?: string;
  title: string;
  artist: string;
  description: string;
  image?: string;
  price: number | string;
  salePrice: number | string;
  stock: number | string;
  versions: string;
  badge: string;
  categoryId: string;
  isPreorder: boolean;
  isNew: boolean;
  isBest: boolean;
  isHotDeal: boolean;
  isRestocked: boolean;
};

const BADGES = ["", "예약", "신상", "베스트", "핫딜", "재입고"];
// 뱃지 표시(한국어 / 베트남어) — 저장값은 한국어 그대로
const BADGE_LABEL: Record<string, string> = {
  "": "없음 / Không",
  예약: "예약 / Đặt trước",
  신상: "신상 / Mới",
  베스트: "베스트 / Bán chạy",
  핫딜: "핫딜 / Giá sốc",
  재입고: "재입고 / Về hàng",
};
const FLAGS: { key: keyof Initial; label: string }[] = [
  { key: "isPreorder", label: "예약판매 / Đặt trước" },
  { key: "isNew", label: "신상품 / Hàng mới" },
  { key: "isBest", label: "베스트 / Bán chạy" },
  { key: "isHotDeal", label: "핫딜 / Giá sốc" },
  { key: "isRestocked", label: "재입고 / Về hàng" },
];

export default function AdminProductForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: Initial;
}) {
  const router = useRouter();
  const isEdit = !!initial?.id;
  const [form, setForm] = useState<Initial>(
    initial || {
      title: "",
      artist: "",
      description: "",
      image: "",
      price: "",
      salePrice: "",
      stock: 100,
      versions: "",
      badge: "",
      categoryId: categories[0]?.id || "",
      isPreorder: false,
      isNew: true,
      isBest: false,
      isHotDeal: false,
      isRestocked: false,
    }
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  function set<K extends keyof Initial>(k: K, v: Initial[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) {
      setError(data.error || "업로드 실패 / Tải lên thất bại");
      return;
    }
    set("image", data.url);
  }

  // 미리보기: 업로드한 이미지가 있으면 그걸, 없으면 자동 생성 커버
  const previewSrc =
    form.image ||
    `/api/cover?t=${encodeURIComponent(form.title || "K-PLAYGROUND")}&a=${encodeURIComponent(
      form.artist || ""
    )}&c=3`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.title || !form.artist || !form.price || !form.salePrice) {
      setError("필수 항목을 입력해주세요. / Vui lòng nhập các mục bắt buộc.");
      return;
    }
    setLoading(true);
    const url = isEdit ? `/api/admin/products/${initial!.id}` : "/api/admin/products";
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "오류가 발생했습니다. / Đã xảy ra lỗi.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  const input =
    "mt-1 w-full px-4 py-2.5 rounded-xl border border-pink-100 focus:border-[var(--color-primary)] outline-none";

  return (
    <form onSubmit={submit} className="rounded-3xl bg-white ring-1 ring-pink-100 p-7 space-y-5 max-w-2xl">
      {/* 상품 이미지 */}
      <div>
        <label className="text-sm font-semibold block mb-2">상품 이미지 / Hình ảnh sản phẩm</label>
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewSrc}
            alt="미리보기"
            className="w-28 h-28 rounded-2xl object-cover ring-1 ring-pink-100 shrink-0"
          />
          <div className="flex-1 space-y-2">
            <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-pink-50 text-[var(--color-primary)] font-semibold text-sm cursor-pointer hover:bg-pink-100">
              {uploading ? "업로드 중... / Đang tải..." : "📷 사진 올리기 / Tải ảnh"}
              <input
                type="file"
                accept="image/*"
                onChange={onPickFile}
                disabled={uploading}
                className="hidden"
              />
            </label>
            {form.image ? (
              <button
                type="button"
                onClick={() => set("image", "")}
                className="block text-xs text-[var(--color-muted)] hover:text-[var(--color-primary)] underline"
              >
                사진 제거 (자동 커버로) / Xóa ảnh (dùng bìa tự động)
              </button>
            ) : (
              <p className="text-xs text-[var(--color-muted)]">
                JPG/PNG/WEBP · 5MB 이하 · 정사각형(1:1) 권장.
                <br />올리지 않으면 컬러풀 커버가 자동 생성돼요.
                <br />
                <span className="text-[var(--color-muted)]/80">
                  Khuyến nghị ảnh vuông (1:1), tối đa 5MB. Bỏ trống sẽ tự tạo ảnh bìa.
                </span>
              </p>
            )}
            <input
              value={form.image || ""}
              onChange={(e) => set("image", e.target.value)}
              placeholder="또는 이미지 URL / hoặc dán URL ảnh"
              className="w-full px-3 py-2 rounded-lg border border-pink-100 focus:border-[var(--color-primary)] outline-none text-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold">상품명 / Tên sản phẩm *</label>
          <input value={form.title} onChange={(e) => set("title", e.target.value)} className={input} />
        </div>
        <div>
          <label className="text-sm font-semibold">아티스트 / Nghệ sĩ *</label>
          <input value={form.artist} onChange={(e) => set("artist", e.target.value)} className={input} />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold">설명 / Mô tả</label>
        <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className={input} />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-semibold">정가 / Giá gốc *</label>
          <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} className={input} />
        </div>
        <div>
          <label className="text-sm font-semibold">판매가 / Giá bán *</label>
          <input type="number" value={form.salePrice} onChange={(e) => set("salePrice", e.target.value)} className={input} />
        </div>
        <div>
          <label className="text-sm font-semibold">재고 / Tồn kho</label>
          <input type="number" value={form.stock} onChange={(e) => set("stock", e.target.value)} className={input} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold">카테고리 / Danh mục</label>
          <select value={form.categoryId} onChange={(e) => set("categoryId", e.target.value)} className={input}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold">뱃지 / Nhãn</label>
          <select value={form.badge} onChange={(e) => set("badge", e.target.value)} className={input}>
            {BADGES.map((b) => (
              <option key={b} value={b}>{BADGE_LABEL[b]}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold">버전 / Phiên bản (쉼표로 구분 / phân cách bằng dấu phẩy)</label>
        <input value={form.versions} onChange={(e) => set("versions", e.target.value)} placeholder="A ver., B ver., 세트" className={input} />
      </div>

      <div>
        <label className="text-sm font-semibold block mb-2">노출 섹션 / Khu vực hiển thị</label>
        <div className="flex flex-wrap gap-2">
          {FLAGS.map((f) => (
            <button
              type="button"
              key={f.key}
              onClick={() => set(f.key, !form[f.key] as never)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 ${
                form[f.key]
                  ? "border-[var(--color-primary)] bg-pink-50 text-[var(--color-primary)]"
                  : "border-pink-100 text-[var(--color-muted)]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-[var(--color-primary)]">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="px-6 py-3 rounded-xl border-2 border-pink-100 font-bold"
        >
          취소 / Hủy
        </button>
        <button
          disabled={loading}
          className="flex-1 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:bg-[var(--color-primary-dark)] disabled:opacity-60"
        >
          {loading ? "저장 중... / Đang lưu..." : isEdit ? "수정하기 / Cập nhật" : "등록하기 / Đăng"}
        </button>
      </div>
      {!isEdit && (
        <p className="text-xs text-[var(--color-muted)]">
          * 이미지는 자동으로 컬러풀한 커버가 생성됩니다. / Ảnh bìa sẽ được tạo tự động.
        </p>
      )}
    </form>
  );
}
