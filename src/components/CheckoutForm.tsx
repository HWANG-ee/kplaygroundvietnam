"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart";
import { won } from "@/lib/format";

const SHIPPING = 3000;
const FREE_OVER = 50000;

export default function CheckoutForm({
  user,
}: {
  user: { name: string; mileage: number };
}) {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({
    recipient: user.name,
    phone: "",
    address: "",
    memo: "",
  });
  const [pay, setPay] = useState("vnpay");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => setMounted(true), []);

  // VNPay 콜백 실패 시 ?error= 로 돌아옴
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("error");
    if (p === "payment_failed") setError("결제가 취소되었거나 실패했습니다. 다시 시도해주세요.");
    else if (p === "invalid_signature") setError("결제 서명 검증에 실패했습니다.");
    else if (p === "order_not_found") setError("주문을 찾을 수 없습니다.");
  }, []);

  if (!mounted) return <div className="py-20" />;

  if (items.length === 0) {
    return (
      <div className="py-20 text-center text-[var(--color-muted)]">
        주문할 상품이 없습니다.
        <button
          onClick={() => router.push("/")}
          className="block mx-auto mt-4 px-6 py-2.5 rounded-full bg-[var(--color-primary)] text-white font-bold"
        >
          쇼핑하러 가기
        </button>
      </div>
    );
  }

  const sub = subtotal();
  const shipping = sub >= FREE_OVER ? 0 : SHIPPING;
  const total = sub + shipping;

  function set(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit() {
    setError("");
    if (!form.recipient || !form.phone || !form.address) {
      setError("배송 정보를 모두 입력해주세요.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          version: i.version,
        })),
        payment: pay,
        ...form,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setLoading(false);
      setError(data.error);
      return;
    }
    clear();
    // VNPay 결제창으로 이동 (자격증명 미설정 시 paymentUrl 없이 즉시 완료)
    if (data.paymentUrl) {
      window.location.href = data.paymentUrl;
      return;
    }
    router.push(`/order/complete?no=${data.orderNumber}`);
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {/* shipping */}
        <section className="rounded-3xl bg-white ring-1 ring-pink-100 p-6">
          <h2 className="font-black text-lg mb-4">🚚 배송 정보</h2>
          <div className="space-y-3">
            <Field label="받는 분" value={form.recipient} onChange={(v) => set("recipient", v)} />
            <Field label="연락처" value={form.phone} onChange={(v) => set("phone", v)} placeholder="010-0000-0000" />
            <Field label="주소" value={form.address} onChange={(v) => set("address", v)} placeholder="배송받으실 주소를 입력하세요" />
            <Field label="배송 메모" value={form.memo} onChange={(v) => set("memo", v)} placeholder="문 앞에 놓아주세요 (선택)" />
          </div>
        </section>

        {/* items */}
        <section className="rounded-3xl bg-white ring-1 ring-pink-100 p-6">
          <h2 className="font-black text-lg mb-4">📦 주문 상품 ({items.length})</h2>
          <div className="space-y-3">
            {items.map((it) => (
              <div key={`${it.productId}-${it.version}`} className="flex gap-3 items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.image} alt={it.title} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold line-clamp-1">{it.title}</p>
                  <p className="text-xs text-[var(--color-muted)]">
                    {it.version && `${it.version} · `}수량 {it.quantity}
                  </p>
                </div>
                <span className="font-bold text-sm">{won(it.salePrice * it.quantity)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* payment method */}
        <section className="rounded-3xl bg-white ring-1 ring-pink-100 p-6">
          <h2 className="font-black text-lg mb-4">💳 결제 수단</h2>
          <div className="grid grid-cols-2 gap-2">
            {[
              { k: "vnpay", label: "🇻🇳 VNPay (QR · 카드 · 계좌)" },
              { k: "demo", label: "데모 결제 (즉시완료)" },
            ].map((m) => (
              <button
                key={m.k}
                onClick={() => setPay(m.k)}
                className={`py-3 rounded-xl text-sm font-semibold border-2 ${
                  pay === m.k
                    ? "border-[var(--color-primary)] bg-pink-50 text-[var(--color-primary)]"
                    : "border-pink-100"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-[var(--color-muted)] mt-3">
            * VNPay 자격증명이 설정되면 결제창(QR)으로 이동합니다. 미설정 시 데모로 즉시 완료됩니다.
          </p>
        </section>
      </div>

      {/* summary */}
      <div>
        <div className="rounded-3xl bg-white ring-1 ring-pink-100 p-6 sticky top-40">
          <h2 className="font-black text-lg mb-4">결제 금액</h2>
          <div className="space-y-2 text-sm">
            <Row label="상품금액" value={won(sub)} />
            <Row label="배송비" value={shipping === 0 ? "무료" : won(shipping)} />
            <Row label="보유 마일리지" value={`${user.mileage.toLocaleString()}P`} muted />
          </div>
          <div className="border-t border-pink-100 my-4" />
          <div className="flex justify-between items-center mb-1">
            <span className="font-bold">총 결제금액</span>
            <span className="text-2xl font-black text-[var(--color-primary)]">{won(total)}</span>
          </div>
          <p className="text-xs text-[var(--color-mint)] font-semibold mb-5">
            +{Math.floor(sub * 0.01).toLocaleString()}P 적립 예정
          </p>
          {error && <p className="text-sm text-[var(--color-primary)] mb-3">{error}</p>}
          <button
            onClick={submit}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:bg-[var(--color-primary-dark)] disabled:opacity-60"
          >
            {loading ? "결제 중..." : `${won(total)} 결제하기`}
          </button>
        </div>
      </div>
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
      <label className="text-sm font-semibold">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full px-4 py-2.5 rounded-xl border border-pink-100 focus:border-[var(--color-primary)] outline-none"
      />
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-[var(--color-muted)]">{label}</span>
      <span className={muted ? "text-[var(--color-muted)]" : "font-semibold"}>{value}</span>
    </div>
  );
}
