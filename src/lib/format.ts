// 데모 환산 환율: 1 KRW ≈ 18 VND.
// 저장값(price/salePrice/order.total 등)은 KRW 스케일 그대로 두고,
// 화면 표시와 결제 금액만 VND로 환산해 일관성을 유지한다.
export const KRW_TO_VND = 18;

/** KRW 스케일 정수를 실제 청구할 VND 정수로 환산 */
export function toVnd(krw: number) {
  return Math.round(krw * KRW_TO_VND);
}

/** 가격 표시 (베트남 동 ₫). 함수명은 기존 호출부 호환을 위해 won 유지 */
export function won(n: number) {
  return toVnd(n).toLocaleString("vi-VN") + "₫";
}

export function discountRate(price: number, salePrice: number) {
  if (price <= 0 || salePrice >= price) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}

export function parseJsonArray(value: string): string[] {
  try {
    const v = JSON.parse(value);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
