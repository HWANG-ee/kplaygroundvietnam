import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCallback } from "@/lib/payment/vnpay";
import { toVnd } from "@/lib/format";

/**
 * 서버-투-서버 결제결과 통보(IPN). VNPay가 직접 호출하므로 공개 HTTPS URL 필요.
 * VNPay 규격에 맞춰 { RspCode, Message } JSON 으로 응답해야 한다.
 */
export async function GET(req: NextRequest) {
  const query: Record<string, string> = {};
  req.nextUrl.searchParams.forEach((v, k) => (query[k] = v));

  const { valid, success, orderNumber, amountVnd } = verifyCallback(query);

  if (!valid) {
    return NextResponse.json({ RspCode: "97", Message: "Checksum failed" });
  }

  const order = await prisma.order.findUnique({ where: { orderNumber } });
  if (!order) {
    return NextResponse.json({ RspCode: "01", Message: "Order not found" });
  }
  if (toVnd(order.total) !== Math.round(amountVnd)) {
    return NextResponse.json({ RspCode: "04", Message: "Invalid amount" });
  }
  if (order.status !== "결제대기") {
    // 이미 처리된 주문 (멱등)
    return NextResponse.json({ RspCode: "02", Message: "Order already confirmed" });
  }

  if (success) {
    await prisma.order.update({ where: { id: order.id }, data: { status: "결제완료" } });
    await prisma.user.update({
      where: { id: order.userId },
      data: { mileage: { increment: Math.floor((order.total * 0.99) * 0.01) } },
    });
  } else {
    await prisma.order.update({ where: { id: order.id }, data: { status: "취소" } });
  }

  return NextResponse.json({ RspCode: "00", Message: "Confirm Success" });
}
