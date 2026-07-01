import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { getSession, isStaff } from "@/lib/auth";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!isStaff(session?.role)) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { error: "이미지 파일(JPG, PNG, WEBP, GIF)만 업로드할 수 있습니다." },
        { status: 400 }
      );
    }
    if (file.size > MAX) {
      return NextResponse.json({ error: "이미지는 5MB 이하만 가능합니다." }, { status: 400 });
    }

    const ext = (file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "");
    const filename = `${randomUUID()}.${ext}`;
    const bytes = Buffer.from(await file.arrayBuffer());

    // 1) Vercel Blob 연결됨(BLOB_READ_WRITE_TOKEN 존재) → 클라우드 영구 저장
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import("@vercel/blob");
      const blob = await put(`uploads/${filename}`, bytes, {
        access: "public",
        contentType: file.type,
        addRandomSuffix: false,
      });
      return NextResponse.json({ ok: true, url: blob.url });
    }

    // 2) 서버리스(Vercel)인데 Blob 미연결 → 파일 저장 불가 안내
    if (process.env.VERCEL) {
      return NextResponse.json(
        {
          error:
            "이미지 업로드를 사용하려면 Vercel Blob 연결이 필요합니다. (Storage → Blob 연결 후 재배포) 또는 이미지 URL을 붙여넣으세요.",
        },
        { status: 501 }
      );
    }

    // 3) 로컬 개발 → public/uploads 에 저장
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), bytes);
    return NextResponse.json({ ok: true, url: `/uploads/${filename}` });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "업로드 실패" }, { status: 500 });
  }
}
