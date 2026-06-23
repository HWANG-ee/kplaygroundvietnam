import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function cover(t: string, a: string, c: number, e = "♪") {
  const p = new URLSearchParams({ t, a, c: String(c), e });
  return `/api/cover?${p.toString()}`;
}

const categories = [
  { slug: "kpop-album", name: "K-POP 앨범", kind: "album", order: 1 },
  { slug: "ost", name: "OST", kind: "album", order: 2 },
  { slug: "vinyl", name: "LP / 바이닐", kind: "album", order: 3 },
  { slug: "season", name: "시즌그리팅", kind: "album", order: 4 },
  { slug: "lightstick", name: "응원봉", kind: "goods", order: 5 },
  { slug: "photocard", name: "포토카드", kind: "goods", order: 6 },
  { slug: "apparel", name: "의류 / 패션", kind: "goods", order: 7 },
  { slug: "stationery", name: "문구 / 리빙", kind: "goods", order: 8 },
];

type P = {
  title: string;
  artist: string;
  cat: string;
  price: number;
  salePrice: number;
  emoji?: string;
  versions?: string[];
  flags?: Partial<{
    isPreorder: boolean;
    isBest: boolean;
    isNew: boolean;
    isHotDeal: boolean;
    isRestocked: boolean;
    badge: string;
  }>;
  stock?: number;
};

const products: P[] = [
  // 예약판매
  { title: "정규 3집 [PLAYGROUND]", artist: "AURORA", cat: "kpop-album", price: 22000, salePrice: 17900, emoji: "🌌", versions: ["A ver.", "B ver.", "C ver.", "세트"], flags: { isPreorder: true, isNew: true, badge: "예약" } },
  { title: "미니 2집 [Neon Dream]", artist: "BLOOMZ", cat: "kpop-album", price: 19800, salePrice: 15800, emoji: "💖", versions: ["RANDOM", "포토북 ver."], flags: { isPreorder: true, badge: "예약" } },
  { title: "싱글 [Firework]", artist: "STELLAR", cat: "kpop-album", price: 13200, salePrice: 11100, emoji: "🎆", versions: ["RANDOM"], flags: { isPreorder: true, badge: "예약" } },
  { title: "정규 1집 [GENESIS]", artist: "NOVA8", cat: "kpop-album", price: 25000, salePrice: 19900, emoji: "✨", versions: ["Light ver.", "Dark ver."], flags: { isPreorder: true, isHotDeal: true, badge: "예약" } },

  // 신상품
  { title: "미니 4집 [Sweet Spot]", artist: "BLOOMZ", cat: "kpop-album", price: 18900, salePrice: 14500, emoji: "🍭", versions: ["A ver.", "B ver."], flags: { isNew: true, badge: "신상" } },
  { title: "정규 2집 [Cosmos]", artist: "AURORA", cat: "kpop-album", price: 23000, salePrice: 18400, emoji: "🪐", versions: ["RANDOM", "세트"], flags: { isNew: true, badge: "신상" } },
  { title: "리패키지 [Re:PLAY]", artist: "NOVA8", cat: "kpop-album", price: 21000, salePrice: 16800, emoji: "🔁", flags: { isNew: true, isBest: true, badge: "신상" } },
  { title: "OST [너의 계절]", artist: "Various Artists", cat: "ost", price: 16500, salePrice: 14900, emoji: "🍂", flags: { isNew: true, badge: "신상" } },

  // 베스트
  { title: "정규 5집 [SUPERNOVA]", artist: "STELLAR", cat: "kpop-album", price: 24000, salePrice: 18900, emoji: "💫", versions: ["A", "B", "C", "D", "세트"], flags: { isBest: true, badge: "베스트" } },
  { title: "미니 1집 [Hello World]", artist: "NOVA8", cat: "kpop-album", price: 17000, salePrice: 13600, emoji: "👋", flags: { isBest: true, badge: "베스트" } },
  { title: "베스트앨범 [GOLDEN HITS]", artist: "AURORA", cat: "kpop-album", price: 28000, salePrice: 22400, emoji: "🏆", flags: { isBest: true, badge: "베스트" } },
  { title: "스페셜 [Winter Magic]", artist: "BLOOMZ", cat: "kpop-album", price: 19500, salePrice: 15600, emoji: "❄️", flags: { isBest: true, badge: "베스트" } },

  // 핫딜
  { title: "미니 3집 [Retro Pop]", artist: "STELLAR", cat: "kpop-album", price: 18000, salePrice: 9900, emoji: "📼", flags: { isHotDeal: true, badge: "핫딜" } },
  { title: "싱글 [Bubble]", artist: "BLOOMZ", cat: "kpop-album", price: 12000, salePrice: 6900, emoji: "🫧", flags: { isHotDeal: true, badge: "핫딜" } },
  { title: "정규 1집 [First Light]", artist: "AURORA", cat: "kpop-album", price: 22000, salePrice: 12100, emoji: "🌅", flags: { isHotDeal: true, badge: "핫딜" } },
  { title: "OST [봄날의 약속]", artist: "Various Artists", cat: "ost", price: 17000, salePrice: 9900, emoji: "🌸", flags: { isHotDeal: true, badge: "핫딜" } },

  // 재입고
  { title: "미니 2집 [Galaxy]", artist: "NOVA8", cat: "kpop-album", price: 18500, salePrice: 14800, emoji: "🌠", flags: { isRestocked: true, badge: "재입고" } },
  { title: "정규 4집 [ECLIPSE]", artist: "STELLAR", cat: "kpop-album", price: 24500, salePrice: 19600, emoji: "🌑", flags: { isRestocked: true, badge: "재입고" } },

  // OST / Vinyl / Season
  { title: "드라마 OST [별빛 아래]", artist: "Various Artists", cat: "ost", price: 18000, salePrice: 16200, emoji: "🌟", flags: { isBest: true } },
  { title: "LP [PLAYGROUND on Vinyl]", artist: "AURORA", cat: "vinyl", price: 49000, salePrice: 44100, emoji: "🎵", flags: { isNew: true, badge: "신상" } },
  { title: "LP [Neon Dream Vinyl]", artist: "BLOOMZ", cat: "vinyl", price: 52000, salePrice: 46800, emoji: "🎶" },
  { title: "2026 시즌그리팅 [PLAY DAY]", artist: "NOVA8", cat: "season", price: 39000, salePrice: 35100, emoji: "📅", flags: { isPreorder: true, badge: "예약" } },
  { title: "2026 시즌그리팅 [STAR DIARY]", artist: "STELLAR", cat: "season", price: 42000, salePrice: 37800, emoji: "⭐", flags: { isPreorder: true, badge: "예약" } },

  // Goods - lightstick
  { title: "공식 응원봉 Ver.2", artist: "AURORA", cat: "lightstick", price: 38000, salePrice: 35000, emoji: "🔦", flags: { isBest: true, badge: "베스트" } },
  { title: "공식 응원봉 [STAR BONG]", artist: "STELLAR", cat: "lightstick", price: 39000, salePrice: 36000, emoji: "✨", flags: { isNew: true, badge: "신상" } },
  { title: "응원봉 키링", artist: "NOVA8", cat: "lightstick", price: 12000, salePrice: 9900, emoji: "🗝️", flags: { isHotDeal: true, badge: "핫딜" } },

  // Goods - photocard
  { title: "포토카드 세트 (8종)", artist: "BLOOMZ", cat: "photocard", price: 15000, salePrice: 12000, emoji: "🖼️", flags: { isBest: true, badge: "베스트" } },
  { title: "포토카드 바인더", artist: "K-PLAYGROUND", cat: "photocard", price: 18000, salePrice: 14400, emoji: "📒", flags: { isNew: true } },
  { title: "랜덤 포토카드 (5장)", artist: "AURORA", cat: "photocard", price: 9000, salePrice: 6900, emoji: "🎴", flags: { isHotDeal: true, badge: "핫딜" } },

  // Goods - apparel
  { title: "투어 오버핏 후디", artist: "STELLAR", cat: "apparel", price: 59000, salePrice: 49900, emoji: "🧥", versions: ["S", "M", "L", "XL"], flags: { isBest: true, badge: "베스트" } },
  { title: "로고 반팔 티셔츠", artist: "K-PLAYGROUND", cat: "apparel", price: 32000, salePrice: 25600, emoji: "👕", versions: ["S", "M", "L"], flags: { isNew: true, badge: "신상" } },
  { title: "볼캡 (블랙)", artist: "NOVA8", cat: "apparel", price: 29000, salePrice: 23200, emoji: "🧢" },

  // Goods - stationery
  { title: "데일리 다이어리 2026", artist: "K-PLAYGROUND", cat: "stationery", price: 16000, salePrice: 12800, emoji: "📔", flags: { isNew: true } },
  { title: "스티커 팩 (3종)", artist: "BLOOMZ", cat: "stationery", price: 8000, salePrice: 5900, emoji: "🩷", flags: { isHotDeal: true, badge: "핫딜" } },
  { title: "아크릴 스탠드", artist: "AURORA", cat: "stationery", price: 14000, salePrice: 11200, emoji: "🪞", flags: { isBest: true } },
  { title: "머그컵 [PLAY]", artist: "K-PLAYGROUND", cat: "stationery", price: 18000, salePrice: 14400, emoji: "☕" },
];

function slugify(s: string, i: number) {
  // ASCII-only slug to avoid URL-encoding issues with Korean characters
  const base = s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return (base || "item") + "-" + i;
}

async function main() {
  console.log("🌱 Seeding...");

  // wipe
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const catMap: Record<string, string> = {};
  for (const c of categories) {
    const created = await prisma.category.create({ data: c });
    catMap[c.slug] = created.id;
  }

  let i = 0;
  for (const p of products) {
    i++;
    const colorIdx = i % 10;
    await prisma.product.create({
      data: {
        slug: slugify(p.artist + "-" + p.title, i),
        title: p.title,
        artist: p.artist,
        description:
          `${p.artist}의 ${p.title}. K-PLAYGROUND 단독 특전 포함! 한정 수량으로 준비된 정품 상품입니다. ` +
          `초동 구매 시 랜덤 포토카드와 응모권을 드립니다.`,
        image: cover(p.title, p.artist, colorIdx, p.emoji || "♪"),
        images: JSON.stringify([
          cover(p.title + " - 1", p.artist, (colorIdx + 1) % 10, p.emoji || "♪"),
          cover(p.title + " - 2", p.artist, (colorIdx + 3) % 10, "💿"),
        ]),
        price: p.price,
        salePrice: p.salePrice,
        stock: p.stock ?? 100,
        versions: JSON.stringify(p.versions ?? []),
        badge: p.flags?.badge ?? "",
        isPreorder: p.flags?.isPreorder ?? false,
        isBest: p.flags?.isBest ?? false,
        isNew: p.flags?.isNew ?? false,
        isHotDeal: p.flags?.isHotDeal ?? false,
        isRestocked: p.flags?.isRestocked ?? false,
        categoryId: catMap[p.cat],
      },
    });
  }

  // users
  const adminPw = await bcrypt.hash("admin1234", 10);
  const userPw = await bcrypt.hash("user1234", 10);
  await prisma.user.create({
    data: {
      email: "admin@kplayground.co.kr",
      password: adminPw,
      name: "관리자",
      role: "admin",
      mileage: 50000,
    },
  });
  await prisma.user.create({
    data: {
      email: "user@test.com",
      password: userPw,
      name: "김덕질",
      role: "user",
      mileage: 3200,
    },
  });

  console.log(`✅ ${categories.length} categories, ${products.length} products, 2 users`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
