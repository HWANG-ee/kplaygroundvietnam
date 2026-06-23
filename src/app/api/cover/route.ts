import { NextRequest } from "next/server";

const PALETTES = [
  ["#FF6FB5", "#FFC371"],
  ["#7F7FD5", "#86A8E7"],
  ["#43E97B", "#38F9D7"],
  ["#FA709A", "#FEE140"],
  ["#A18CD1", "#FBC2EB"],
  ["#4FACFE", "#00F2FE"],
  ["#FF9A9E", "#FECFEF"],
  ["#30CFD0", "#330867"],
  ["#F093FB", "#F5576C"],
  ["#5EE7DF", "#B490CA"],
];

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("t") || "K-PLAYGROUND").slice(0, 40);
  const artist = (searchParams.get("a") || "").slice(0, 30);
  const c = parseInt(searchParams.get("c") || "0", 10) % PALETTES.length;
  const [c1, c2] = PALETTES[c];
  const emoji = searchParams.get("e") || "♪";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${c1}"/>
      <stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#g)"/>
  <circle cx="480" cy="120" r="160" fill="rgba(255,255,255,0.12)"/>
  <circle cx="120" cy="500" r="120" fill="rgba(255,255,255,0.10)"/>
  <text x="50" y="120" font-size="80" opacity="0.85">${esc(emoji)}</text>
  <text x="50" y="500" font-family="Pretendard, Arial, sans-serif" font-size="46" font-weight="800" fill="#ffffff">${esc(artist)}</text>
  <text x="50" y="555" font-family="Pretendard, Arial, sans-serif" font-size="30" font-weight="500" fill="rgba(255,255,255,0.92)">${esc(title)}</text>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
