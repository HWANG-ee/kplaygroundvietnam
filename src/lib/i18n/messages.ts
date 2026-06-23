import type { Locale } from "./config";

export type Messages = typeof ko;

const ko = {
  header: {
    announce:
      "🎉 K-PLAYGROUND 오픈 기념 첫 구매 5,000원 할인 · 5만원 이상 무료배송 · 예약판매 단독 특전 증정 · 신규가입 3,000 마일리지 🎁",
    hello: "{name}님 ✨",
    admin: "관리자",
    mypage: "마이페이지",
    logout: "로그아웃",
    login: "로그인",
    signup: "회원가입",
    orderLookup: "주문조회",
    cs: "고객센터 1670-0000",
    searchPlaceholder: "최애 아티스트, 앨범, 굿즈를 검색해보세요",
    searchShort: "검색",
    category: "카테고리",
    albums: "앨범",
    goods: "굿즈",
    trending: "인기검색어",
    nav: {
      preorder: "예약판매",
      new: "신상품",
      best: "베스트",
      hotdeal: "핫딜",
      restock: "재입고",
    },
  },
  hero: {
    badge: "🎉 GRAND OPEN EVENT",
    title: "최애를 위한 모든 것,",
    titleTail: "지금 K-PLAYGROUND에서.",
    subtitle: "예약판매 단독 특전 · 첫 구매 5,000원 할인 · 5만원 이상 무료배송",
    cta: "예약판매 보러가기 →",
    hotKicker: "🔥 HOT DEAL",
    hotTitle: "최대 50% 할인",
    hotSub: "한정 수량 핫딜 특가",
    goodsKicker: "🎁 GOODS",
    goodsTitle: "응원봉 & 굿즈",
    goodsSub: "콘서트 필수템 모음",
  },
  home: {
    sections: {
      preorder: { title: "예약판매", subtitle: "지금 예약하면 단독 특전까지!" },
      new: { title: "신상품", subtitle: "따끈따끈 방금 입고된 신상" },
      best: { title: "베스트", subtitle: "지금 가장 인기있는 상품" },
      hotdeal: { title: "핫딜", subtitle: "놓치면 후회하는 한정 특가" },
      restock: { title: "재입고", subtitle: "기다리던 그 상품이 돌아왔어요" },
    },
    promoTitle: "🎁 신규 가입하고 3,000 마일리지 받기",
    promoSub: "지금 가입하면 첫 구매 5,000원 추가 할인 쿠폰까지!",
    promoCta: "회원가입 하기",
  },
  product: {
    viewAll: "전체보기",
    soldOut: "품절",
    review: "리뷰",
  },
  badge: {
    예약: "예약",
    신상: "신상",
    베스트: "베스트",
    핫딜: "핫딜",
    재입고: "재입고",
  },
  footer: {
    tagline: "최애를 위한 모든 것.\nK-POP 앨범 & 굿즈샵",
    shopping: "쇼핑",
    support: "고객지원",
    shipping: "배송안내",
    returns: "교환/반품",
    faq: "자주 묻는 질문",
    csCenter: "고객센터",
    hours: "평일 10:00 - 18:00\n점심 12:30 - 13:30\n주말/공휴일 휴무",
    demoNote: "본 사이트는 포트폴리오/데모용으로 제작되었습니다.",
  },
  category: {
    "kpop-album": "K-POP 앨범",
    ost: "OST",
    vinyl: "LP/바이닐",
    season: "시즌그리팅",
    lightstick: "응원봉",
    photocard: "포토카드",
    apparel: "의류",
    stationery: "문구/리빙",
  },
};

const vi: Messages = {
  header: {
    announce:
      "🎉 Khai trương K-PLAYGROUND · Giảm 5.000₩ cho đơn đầu tiên · Miễn phí ship từ 50.000₩ · Quà đặc biệt khi đặt trước · Tặng 3.000 điểm khi đăng ký 🎁",
    hello: "Chào {name} ✨",
    admin: "Quản trị",
    mypage: "Trang của tôi",
    logout: "Đăng xuất",
    login: "Đăng nhập",
    signup: "Đăng ký",
    orderLookup: "Tra cứu đơn hàng",
    cs: "CSKH 1670-0000",
    searchPlaceholder: "Tìm nghệ sĩ, album, goods yêu thích của bạn",
    searchShort: "Tìm kiếm",
    category: "Danh mục",
    albums: "Album",
    goods: "Goods",
    trending: "Tìm nhiều",
    nav: {
      preorder: "Đặt trước",
      new: "Hàng mới",
      best: "Bán chạy",
      hotdeal: "Giá sốc",
      restock: "Về hàng",
    },
  },
  hero: {
    badge: "🎉 SỰ KIỆN KHAI TRƯƠNG",
    title: "Tất cả cho thần tượng của bạn,",
    titleTail: "ngay tại K-PLAYGROUND.",
    subtitle: "Quà đặc biệt khi đặt trước · Giảm 5.000₩ đơn đầu · Miễn phí ship từ 50.000₩",
    cta: "Xem hàng đặt trước →",
    hotKicker: "🔥 GIÁ SỐC",
    hotTitle: "Giảm đến 50%",
    hotSub: "Ưu đãi số lượng có hạn",
    goodsKicker: "🎁 GOODS",
    goodsTitle: "Lightstick & Goods",
    goodsSub: "Đồ must-have đi concert",
  },
  home: {
    sections: {
      preorder: { title: "Đặt trước", subtitle: "Đặt ngay để nhận quà đặc biệt!" },
      new: { title: "Hàng mới", subtitle: "Sản phẩm vừa về, nóng hổi" },
      best: { title: "Bán chạy", subtitle: "Đang được yêu thích nhất" },
      hotdeal: { title: "Giá sốc", subtitle: "Ưu đãi có hạn, đừng bỏ lỡ" },
      restock: { title: "Về hàng", subtitle: "Sản phẩm bạn chờ đã trở lại" },
    },
    promoTitle: "🎁 Đăng ký nhận ngay 3.000 điểm thưởng",
    promoSub: "Đăng ký hôm nay còn nhận thêm coupon giảm 5.000₩ cho đơn đầu!",
    promoCta: "Đăng ký ngay",
  },
  product: {
    viewAll: "Xem tất cả",
    soldOut: "Hết hàng",
    review: "Đánh giá",
  },
  badge: {
    예약: "Đặt trước",
    신상: "Mới",
    베스트: "Bán chạy",
    핫딜: "Giá sốc",
    재입고: "Về hàng",
  },
  footer: {
    tagline: "Tất cả cho thần tượng của bạn.\nCửa hàng album & goods K-POP",
    shopping: "Mua sắm",
    support: "Hỗ trợ",
    shipping: "Thông tin giao hàng",
    returns: "Đổi/Trả hàng",
    faq: "Câu hỏi thường gặp",
    csCenter: "Chăm sóc khách hàng",
    hours: "T2-T6 10:00 - 18:00\nNghỉ trưa 12:30 - 13:30\nNghỉ cuối tuần/lễ",
    demoNote: "Trang web này được tạo cho mục đích demo/portfolio.",
  },
  category: {
    "kpop-album": "Album K-POP",
    ost: "OST",
    vinyl: "Đĩa than/Vinyl",
    season: "Season Greeting",
    lightstick: "Lightstick",
    photocard: "Photocard",
    apparel: "Thời trang",
    stationery: "Văn phòng phẩm",
  },
};

const en: Messages = {
  header: {
    announce:
      "🎉 K-PLAYGROUND Grand Open · ₩5,000 off your first order · Free shipping over ₩50,000 · Pre-order exclusive perks · 3,000 mileage on sign-up 🎁",
    hello: "Hi, {name} ✨",
    admin: "Admin",
    mypage: "My Page",
    logout: "Log out",
    login: "Log in",
    signup: "Sign up",
    orderLookup: "Track order",
    cs: "Support 1670-0000",
    searchPlaceholder: "Search your favorite artist, album, or goods",
    searchShort: "Search",
    category: "Categories",
    albums: "Albums",
    goods: "Goods",
    trending: "Trending",
    nav: {
      preorder: "Pre-order",
      new: "New",
      best: "Best",
      hotdeal: "Hot Deal",
      restock: "Restock",
    },
  },
  hero: {
    badge: "🎉 GRAND OPEN EVENT",
    title: "Everything for your bias,",
    titleTail: "now at K-PLAYGROUND.",
    subtitle: "Pre-order perks · ₩5,000 off first order · Free shipping over ₩50,000",
    cta: "Shop pre-orders →",
    hotKicker: "🔥 HOT DEAL",
    hotTitle: "Up to 50% off",
    hotSub: "Limited-quantity deals",
    goodsKicker: "🎁 GOODS",
    goodsTitle: "Lightsticks & Goods",
    goodsSub: "Concert must-haves",
  },
  home: {
    sections: {
      preorder: { title: "Pre-order", subtitle: "Order now for exclusive perks!" },
      new: { title: "New Arrivals", subtitle: "Fresh in stock right now" },
      best: { title: "Best Sellers", subtitle: "Most loved right now" },
      hotdeal: { title: "Hot Deals", subtitle: "Limited deals you can't miss" },
      restock: { title: "Restocked", subtitle: "The item you waited for is back" },
    },
    promoTitle: "🎁 Sign up and get 3,000 mileage",
    promoSub: "Join today and get an extra ₩5,000 off coupon on your first order!",
    promoCta: "Sign up now",
  },
  product: {
    viewAll: "View all",
    soldOut: "Sold out",
    review: "Reviews",
  },
  badge: {
    예약: "Pre-order",
    신상: "New",
    베스트: "Best",
    핫딜: "Hot Deal",
    재입고: "Restock",
  },
  footer: {
    tagline: "Everything for your bias.\nK-POP album & goods shop",
    shopping: "Shop",
    support: "Support",
    shipping: "Shipping info",
    returns: "Returns/Exchange",
    faq: "FAQ",
    csCenter: "Customer Center",
    hours: "Weekdays 10:00 - 18:00\nLunch 12:30 - 13:30\nClosed weekends/holidays",
    demoNote: "This site was built for portfolio/demo purposes.",
  },
  category: {
    "kpop-album": "K-POP Albums",
    ost: "OST",
    vinyl: "LP/Vinyl",
    season: "Season's Greetings",
    lightstick: "Lightstick",
    photocard: "Photocard",
    apparel: "Apparel",
    stationery: "Stationery/Living",
  },
};

export const MESSAGES: Record<Locale, Messages> = { ko, vi, en };

/** "{name}" 같은 토큰 치환 */
export function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

/** 알려진 카테고리 slug는 번역, 그 외(DB 데이터)는 원래 이름 사용 */
export function categoryName(t: Messages, slug: string, fallback: string) {
  return (t.category as Record<string, string>)[slug] ?? fallback;
}

/** 상품 배지(한국어 데이터값)를 현재 언어로 */
export function badgeLabel(t: Messages, badge: string) {
  return (t.badge as Record<string, string>)[badge] ?? badge;
}
