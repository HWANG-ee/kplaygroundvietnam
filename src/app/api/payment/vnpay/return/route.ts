import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCallback } from "@/lib/payment/vnpay";

/**
 * 사용자 브라우저가 결제 후 돌아오는 곳(vnp_ReturnUrl).
 * 서명을 검증하고 주문 상태를 갱신한 뒤 완료/실패 페이지로 리다이렉트한다.
 * (운영에서는 IPN이 결제확정의 기준이지만, 로컬/샌드박스에서는 여기서도 확정 처리)
 */
export async function GET(req: NextRequest) {
  const query: Record<string, string> = {};
  req.nextUrl.searchParams.forEach((v, k) => (query[k] = v));

  const { valid, success, orderNumber } = verifyCallback(query);
  const origin = req.nextUrl.origin;

  if (!valid) {
    return NextResponse.redirect(`${origin}/checkout?error=invalid_signature`);
  }

  const order = await prisma.order.findUnique({ where: { orderNumber } });
  if (!order) {
    return NextResponse.redirect(`${origin}/checkout?error=order_not_found`);
  }

  if (success) {
    if (order.status === "결제대기") {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "결제완료" },
      });
      // 결제 성공 시 마일리지 1% 적립
      await prisma.user.update({
        where: { id: order.userId },
        data: { mileage: { increment: Math.floor((order.total * 0.99) * 0.01) } },
      });
    }
    return NextResponse.redirect(`${origin}/order/complete?no=${orderNumber}`);
  }

  // 결제 실패/취소
  await prisma.order.update({
    where: { id: order.id },
    data: { status: "취소" },
  });
  return NextResponse.redirect(`${origin}/checkout?error=payment_failed`);
}
