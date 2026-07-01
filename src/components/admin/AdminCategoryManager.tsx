"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save } from "lucide-react";

type Cat = { id: string; name: string; kind: string; order: number; productCount: number };

export default function AdminCategoryManager({ categories }: { categories: Cat[] }) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [newKind, setNewKind] = useState("album");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function add() {
    if (!newName.trim()) return;
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, kind: newKind }),
    });
    setBusy(false);
    const d = await res.json();
    if (!res.ok) return setMsg("❌ " + d.error);
    setNewName("");
    router.refresh();
  }

  const albums = categories.filter((c) => c.kind === "album");
  const goods = categories.filter((c) => c.kind === "goods");

  return (
    <div className="space-y-6 max-w-3xl">
      {/* 추가 */}
      <div className="rounded-3xl bg-white ring-1 ring-pink-100 p-6">
        <h2 className="font-black text-lg mb-4">➕ 새 메뉴 추가 / Thêm menu mới</h2>
        <div className="flex flex-wrap gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="메뉴 이름 / Tên menu (예: 티셔츠)"
            className="flex-1 min-w-[180px] px-4 py-2.5 rounded-xl border border-pink-100 focus:border-[var(--color-primary)] outline-none"
          />
          <select
            value={newKind}
            onChange={(e) => setNewKind(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-pink-100 outline-none"
          >
            <option value="album">앨범 / Album</option>
            <option value="goods">굿즈 / Goods</option>
          </select>
          <button
            onClick={add}
            disabled={busy}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:bg-[var(--color-primary-dark)] disabled:opacity-60"
          >
            <Plus size={18} /> 추가 / Thêm
          </button>
        </div>
        {msg && <p className="text-sm text-[var(--color-primary)] mt-3">{msg}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <CatGroup title="💿 앨범 / Album" cats={albums} />
        <CatGroup title="🎁 굿즈 / Goods" cats={goods} />
      </div>
    </div>
  );
}

function CatGroup({ title, cats }: { title: string; cats: Cat[] }) {
  return (
    <div className="rounded-3xl bg-white ring-1 ring-pink-100 p-6">
      <h2 className="font-black text-lg mb-4">{title}</h2>
      <div className="space-y-2">
        {cats.map((c) => (
          <CatRow key={c.id} cat={c} />
        ))}
        {cats.length === 0 && (
          <p className="text-sm text-[var(--color-muted)] py-4 text-center">메뉴가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

function CatRow({ cat }: { cat: Cat }) {
  const router = useRouter();
  const [name, setName] = useState(cat.name);
  const [kind, setKind] = useState(cat.kind);
  const [busy, setBusy] = useState(false);
  const dirty = name !== cat.name || kind !== cat.kind;

  async function save() {
    setBusy(true);
    const res = await fetch(`/api/admin/categories/${cat.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, kind }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
    else alert((await res.json()).error);
  }

  async function del() {
    if (!confirm(`"${cat.name}" 메뉴를 삭제할까요? / Xóa menu này?`)) return;
    setBusy(true);
    const res = await fetch(`/api/admin/categories/${cat.id}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) router.refresh();
    else alert((await res.json()).error);
  }

  return (
    <div className="flex items-center gap-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-pink-100 focus:border-[var(--color-primary)] outline-none text-sm"
      />
      <select
        value={kind}
        onChange={(e) => setKind(e.target.value)}
        className="px-2 py-2 rounded-lg border border-pink-100 outline-none text-xs"
      >
        <option value="album">앨범</option>
        <option value="goods">굿즈</option>
      </select>
      {dirty && (
        <button
          onClick={save}
          disabled={busy}
          className="p-2 rounded-lg bg-pink-50 text-[var(--color-primary)] hover:bg-pink-100 disabled:opacity-40"
          title="저장 / Lưu"
        >
          <Save size={15} />
        </button>
      )}
      <button
        onClick={del}
        disabled={busy}
        className="p-2 rounded-lg hover:bg-pink-50 text-[var(--color-primary)] disabled:opacity-40 relative"
        title={cat.productCount > 0 ? `상품 ${cat.productCount}개 있음` : "삭제 / Xóa"}
      >
        <Trash2 size={15} />
        {cat.productCount > 0 && (
          <span className="absolute -top-1 -right-1 text-[9px] bg-[var(--color-muted)] text-white rounded-full w-4 h-4 grid place-items-center">
            {cat.productCount}
          </span>
        )}
      </button>
    </div>
  );
}
