import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { toVnd } from "@/lib/format";
import { vnpayConfigured, createPaymentUrl } from "@/lib/payment/vnpay";

const SHIPPING = 3000;
const FREE_OVER = 50000;

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { items, recipient, phone, address, memo, payment } = body as {
      items: { productId: string; quantity: number; version: string }[];
      recipient: string;
      phone: string;
      address: string;
      memo?: string;
      payment?: string;
    };

    // VNPay 결제 + 자격증명이 있으면 결제대기 상태로 생성 후 결제창으로 보낸다
    const useVnpay = payment === "vnpay" && vnpayConfigured();

    if (!items?.length) {
      return NextResponse.json({ error: "장바구니가 비어있습니다." }, { status: 400 });
    }
    if (!recipient || !phone || !address) {
      return NextResponse.json({ error: "배송 정보를 모두 입력해주세요." }, { status: 400 });
    }

    // 가격은 서버 DB 기준으로 다시 계산 (신뢰 가능)
    const ids = items.map((i) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: ids } } });
    const pmap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const orderItems = items.map((i) => {
      const p = pmap.get(i.productId);
      if (!p) throw new Error("상품을 찾을 수 없습니다.");
      const qty = Math.max(1, i.quantity);
      subtotal += p.salePrice * qty;
      return {
        productId: p.id,
        quantity: qty,
        price: p.salePrice,
        version: i.version || "",
      };
    });

    const shipping = subtotal >= FREE_OVER ? 0 : SHIPPING;
    const total = subtotal + shipping;
    const orderNumber =
      "KPG" +
      new Date().toISOString().slice(0, 10).replace(/-/g, "") +
      Math.floor(1000 + Math.random() * 9000);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.userId,
        total,
        status: useVnpay ? "결제대기" : "결제완료",
        recipient,
        phone,
        address,
        memo: memo || "",
        items: { create: orderItems },
      },
    });

    // VNPay: 결제창 URL 생성 후 전달 (마일리지는 결제 성공 콜백에서 적립)
    if (useVnpay) {
      const ipAddr =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
      const paymentUrl = createPaymentUrl({
        orderNumber: order.orderNumber,
        amountVnd: toVnd(total),
        orderInfo: `Thanh toan don hang ${order.orderNumber}`,
        ipAddr,
        returnUrl: `${req.nextUrl.origin}/api/payment/vnpay/return`,
      });
      return NextResponse.json({ ok: true, orderNumber: order.orderNumber, paymentUrl });
    }

    // 데모(즉시 완료) 결제: 마일리지 1% 적립
    await prisma.user.update({
      where: { id: session.userId },
      data: { mileage: { increment: Math.floor(subtotal * 0.01) } },
    });

    return NextResponse.json({ ok: true, orderNumber: order.orderNumber });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "주문 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
