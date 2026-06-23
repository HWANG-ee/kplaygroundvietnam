import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { getSession } from "@/lib/auth";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  // Vercel 등 서버리스 환경은 파일 저장이 불가(읽기 전용 FS).
  // 운영에서는 이미지 URL 붙여넣기 또는 자동 커버를 사용하세요.
  if (process.env.VERCEL) {
    return NextResponse.json(
      {
        error:
          "운영 환경에서는 파일 업로드가 비활성화되어 있습니다. 이미지 URL을 붙여넣거나 자동 커버를 사용하세요. (영구 업로드는 Vercel Blob 연결 시 가능)",
      },
      { status: 501 }
    );
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
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(dir, filename), bytes);

    return NextResponse.json({ ok: true, url: `/uploads/${filename}` });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "업로드 실패" }, { status: 500 });
  }
}
