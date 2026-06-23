"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Gift } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(k: string, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error);
    router.push("/");
    router.refresh();
  }

  return (
    <div className="container-x py-16 max-w-md">
      <div className="text-center mb-8">
        <span className="inline-grid place-items-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-mint)] to-[var(--color-sky)] text-white mb-3 animate-bob">
          <Gift size={26} />
        </span>
        <h1 className="text-2xl font-black">회원가입</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          지금 가입하면 <b className="text-[var(--color-primary)]">3,000 마일리지</b> 즉시 지급! 🎁
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4 bg-white rounded-3xl p-7 shadow-sm ring-1 ring-pink-100">
        <div>
          <label className="text-sm font-semibold">이름</label>
          <input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required
            className="mt-1 w-full px-4 py-2.5 rounded-xl border border-pink-100 focus:border-[var(--color-primary)] outline-none"
            placeholder="홍길동"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">이메일</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            required
            className="mt-1 w-full px-4 py-2.5 rounded-xl border border-pink-100 focus:border-[var(--color-primary)] outline-none"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">비밀번호</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            required
            minLength={6}
            className="mt-1 w-full px-4 py-2.5 rounded-xl border border-pink-100 focus:border-[var(--color-primary)] outline-none"
            placeholder="6자 이상"
          />
        </div>
        {error && <p className="text-sm text-[var(--color-primary)]">{error}</p>}
        <button
          disabled={loading}
          className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:bg-[var(--color-primary-dark)] disabled:opacity-60"
        >
          {loading ? "가입 중..." : "가입하고 마일리지 받기"}
        </button>
        <p className="text-center text-sm text-[var(--color-muted)]">
          이미 회원이신가요?{" "}
          <Link href="/login" className="text-[var(--color-primary)] font-semibold">
            로그인
          </Link>
        </p>
      </form>
    </div>
  );
}
