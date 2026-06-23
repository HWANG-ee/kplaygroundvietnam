"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error);
    router.push(data.role === "admin" ? "/admin" : "/");
    router.refresh();
  }

  return (
    <div className="container-x py-16 max-w-md">
      <div className="text-center mb-8">
        <span className="inline-grid place-items-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white mb-3 animate-bob">
          <Sparkles size={26} />
        </span>
        <h1 className="text-2xl font-black">로그인</h1>
        <p className="text-sm text-[var(--color-muted)] mt-1">
          K-PLAYGROUND에 다시 오신 걸 환영해요!
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4 bg-white rounded-3xl p-7 shadow-sm ring-1 ring-pink-100">
        <div>
          <label className="text-sm font-semibold">이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full px-4 py-2.5 rounded-xl border border-pink-100 focus:border-[var(--color-primary)] outline-none"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full px-4 py-2.5 rounded-xl border border-pink-100 focus:border-[var(--color-primary)] outline-none"
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-sm text-[var(--color-primary)]">{error}</p>}
        <button
          disabled={loading}
          className="w-full py-3 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:bg-[var(--color-primary-dark)] disabled:opacity-60"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
        <p className="text-center text-sm text-[var(--color-muted)]">
          아직 회원이 아니신가요?{" "}
          <Link href="/signup" className="text-[var(--color-primary)] font-semibold">
            회원가입
          </Link>
        </p>
      </form>

      <div className="mt-4 rounded-2xl bg-pink-50 p-4 text-xs text-[var(--color-muted)]">
        <p className="font-semibold text-[var(--color-ink)] mb-1">🧪 데모 계정</p>
        <p>관리자: admin@kplayground.co.kr / admin1234</p>
        <p>일반: user@test.com / user1234</p>
      </div>
    </div>
  );
}
