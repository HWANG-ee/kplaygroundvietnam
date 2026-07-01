"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Settings = {
  companyName: string;
  ceo: string;
  bizNumber: string;
  mailOrderNumber: string;
  address: string;
  privacyOfficer: string;
  phone: string;
  hours: string;
  instagram: string;
  youtube: string;
  twitter: string;
  announceKo: string;
  announceVi: string;
  announceEn: string;
  heroMainImage: string;
  heroHotImage: string;
  heroGoodsImage: string;
};

export default function AdminSettingsForm({ initial }: { initial: Settings }) {
  const router = useRouter();
  const [form, setForm] = useState<Settings>(initial);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  function set<K extends keyof Settings>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function save() {
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      const d = await res.json();
      setMsg("❌ " + (d.error || "저장 실패"));
      return;
    }
    setMsg("✅ 저장되었습니다 / Đã lưu. 바로 반영됩니다.");
    router.refresh();
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Section title="🖼️ 메인 배너 이미지 / Ảnh banner chính">
        <p className="text-xs text-[var(--color-muted)] -mt-1">
          메인 화면 상단 배너 사진입니다. 비우면 기본 디자인이 사용됩니다.
          <br />
          Ảnh banner đầu trang chủ. Để trống sẽ dùng thiết kế mặc định.
        </p>
        <ImageField label="메인 큰 배너 / Banner lớn" value={form.heroMainImage} onChange={(v) => set("heroMainImage", v)} onError={setMsg} />
        <div className="grid sm:grid-cols-2 gap-4">
          <ImageField label="핫딜 배너 / Banner Giá sốc" value={form.heroHotImage} onChange={(v) => set("heroHotImage", v)} onError={setMsg} />
          <ImageField label="굿즈 배너 / Banner Goods" value={form.heroGoodsImage} onChange={(v) => set("heroGoodsImage", v)} onError={setMsg} />
        </div>
      </Section>

      <Section title="📢 상단 공지 (흐르는 배너) / Thông báo trên cùng">
        <p className="text-xs text-[var(--color-muted)] -mt-1">
          맨 위 흐르는 핑크 배너 문구입니다. 언어별로 입력하며, 비워두면 기본 문구가 표시됩니다.
          <br />
          Nội dung băng hồng chạy trên cùng. Nhập theo ngôn ngữ; để trống sẽ dùng mặc định.
        </p>
        <div>
          <label className="text-sm font-semibold block mb-1">🇰🇷 한국어</label>
          <textarea value={form.announceKo} onChange={(e) => set("announceKo", e.target.value)} rows={2}
            placeholder="비우면 기본 문구 사용"
            className="w-full px-4 py-2.5 rounded-xl border border-pink-100 focus:border-[var(--color-primary)] outline-none" />
        </div>
        <div>
          <label className="text-sm font-semibold block mb-1">🇻🇳 Tiếng Việt</label>
          <textarea value={form.announceVi} onChange={(e) => set("announceVi", e.target.value)} rows={2}
            placeholder="Để trống sẽ dùng nội dung mặc định"
            className="w-full px-4 py-2.5 rounded-xl border border-pink-100 focus:border-[var(--color-primary)] outline-none" />
        </div>
        <div>
          <label className="text-sm font-semibold block mb-1">🇬🇧 English</label>
          <textarea value={form.announceEn} onChange={(e) => set("announceEn", e.target.value)} rows={2}
            placeholder="Leave empty to use default"
            className="w-full px-4 py-2.5 rounded-xl border border-pink-100 focus:border-[var(--color-primary)] outline-none" />
        </div>
      </Section>

      <Section title="🏢 회사 정보 / Thông tin công ty">
        <Field label="회사명 / Tên công ty" value={form.companyName} onChange={(v) => set("companyName", v)} />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="대표자 / Người đại diện" value={form.ceo} onChange={(v) => set("ceo", v)} />
          <Field label="개인정보보호책임자 / Phụ trách BVTT cá nhân" value={form.privacyOfficer} onChange={(v) => set("privacyOfficer", v)} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="사업자등록번호 / Mã số doanh nghiệp" value={form.bizNumber} onChange={(v) => set("bizNumber", v)} />
          <Field label="통신판매업신고번호 / Số ĐK bán hàng online" value={form.mailOrderNumber} onChange={(v) => set("mailOrderNumber", v)} />
        </div>
        <Field label="주소 / Địa chỉ" value={form.address} onChange={(v) => set("address", v)} />
      </Section>

      <Section title="📞 고객센터 / Chăm sóc khách hàng">
        <Field label="고객센터 번호 / Số hotline" value={form.phone} onChange={(v) => set("phone", v)} />
        <div>
          <label className="text-sm font-semibold block mb-1">운영시간 / Giờ làm việc (여러 줄 / nhiều dòng)</label>
          <textarea
            value={form.hours}
            onChange={(e) => set("hours", e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-pink-100 focus:border-[var(--color-primary)] outline-none"
          />
        </div>
      </Section>

      <Section title="🔗 SNS 링크 (전체 URL) / Mạng xã hội (URL đầy đủ)">
        <Field label="Instagram" value={form.instagram} onChange={(v) => set("instagram", v)} placeholder="https://instagram.com/..." />
        <Field label="YouTube" value={form.youtube} onChange={(v) => set("youtube", v)} placeholder="https://youtube.com/..." />
        <Field label="X (Twitter)" value={form.twitter} onChange={(v) => set("twitter", v)} placeholder="https://x.com/..." />
      </Section>

      <div className="flex items-center gap-4 sticky bottom-4">
        <button
          onClick={save}
          disabled={saving}
          className="px-7 py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:bg-[var(--color-primary-dark)] disabled:opacity-60 shadow-lg"
        >
          {saving ? "저장 중... / Đang lưu..." : "저장하기 / Lưu"}
        </button>
        {msg && <span className="text-sm font-semibold">{msg}</span>}
      </div>
    </div>
  );
}

function ImageField({
  label,
  value,
  onChange,
  onError,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onError: (msg: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    onError("");
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) {
      onError("❌ " + (data.error || "업로드 실패 / Tải lên thất bại"));
      return;
    }
    onChange(data.url);
  }

  return (
    <div>
      <label className="text-sm font-semibold block mb-1">{label}</label>
      <div className="flex items-start gap-3">
        <div className="w-20 h-20 rounded-xl overflow-hidden ring-1 ring-pink-100 bg-pink-50 shrink-0 grid place-items-center text-[10px] text-[var(--color-muted)]">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            "미리보기"
          )}
        </div>
        <div className="flex-1 space-y-1.5">
          <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-pink-50 text-[var(--color-primary)] font-semibold text-xs cursor-pointer hover:bg-pink-100">
            {uploading ? "업로드 중..." : "📷 사진 올리기 / Tải ảnh"}
            <input type="file" accept="image/*" onChange={onPick} disabled={uploading} className="hidden" />
          </label>
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="또는 이미지 URL / hoặc dán URL ảnh"
            className="w-full px-3 py-2 rounded-lg border border-pink-100 focus:border-[var(--color-primary)] outline-none text-sm"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-xs text-[var(--color-muted)] hover:text-[var(--color-primary)] underline"
            >
              제거 (기본 디자인으로) / Xóa
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-white ring-1 ring-pink-100 p-6 space-y-4">
      <h2 className="font-black text-lg">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-semibold block mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-xl border border-pink-100 focus:border-[var(--color-primary)] outline-none"
      />
    </div>
  );
}
