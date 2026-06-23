import crypto from "crypto";

/**
 * VNPay (VNPAY-QR / 2.1.0) 결제 연동 헬퍼.
 * 필요한 환경변수(.env.local):
 *   VNP_TMN_CODE       가맹점 코드 (VNPay merchant portal)
 *   VNP_HASH_SECRET    서명용 비밀키 (HMAC-SHA512)
 *   VNP_URL            결제 게이트웨이 URL (없으면 샌드박스 기본값)
 * 자격증명이 없으면 vnpayConfigured()=false → 데모 결제로 폴백.
 */

const SANDBOX_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

export function vnpayConfigured(): boolean {
  return Boolean(process.env.VNP_TMN_CODE && process.env.VNP_HASH_SECRET);
}

function encode(v: string) {
  // VNPay 규격: 값은 URL 인코딩 후 공백을 '+'로 (PHP urlencode 호환)
  return encodeURIComponent(v).replace(/%20/g, "+");
}

/** 정렬된 vnp_* 파라미터로 서명 문자열과 HMAC-SHA512 해시를 만든다 */
function sign(params: Record<string, string>, secret: string) {
  const keys = Object.keys(params).sort();
  const data = keys.map((k) => `${k}=${encode(params[k])}`).join("&");
  const hash = crypto.createHmac("sha512", secret).update(Buffer.from(data, "utf-8")).digest("hex");
  return { data, hash };
}

function nowParts(offsetMs = 0) {
  // VNPay는 GMT+7 기준 yyyyMMddHHmmss
  const d = new Date(Date.now() + offsetMs);
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const vn = new Date(utc + 7 * 60 * 60000);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${vn.getFullYear()}${p(vn.getMonth() + 1)}${p(vn.getDate())}${p(vn.getHours())}${p(vn.getMinutes())}${p(vn.getSeconds())}`;
}

export function createPaymentUrl(opts: {
  orderNumber: string;
  amountVnd: number; // 실제 VND 금액 (×100 은 내부 처리)
  orderInfo: string;
  ipAddr: string;
  returnUrl: string;
  locale?: "vn" | "en";
}): string {
  const tmnCode = process.env.VNP_TMN_CODE!;
  const secret = process.env.VNP_HASH_SECRET!;
  const gateway = process.env.VNP_URL || SANDBOX_URL;

  const params: Record<string, string> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Amount: String(Math.round(opts.amountVnd) * 100),
    vnp_CurrCode: "VND",
    vnp_TxnRef: opts.orderNumber,
    vnp_OrderInfo: opts.orderInfo,
    vnp_OrderType: "other",
    vnp_Locale: opts.locale || "vn",
    vnp_ReturnUrl: opts.returnUrl,
    vnp_IpAddr: opts.ipAddr,
    vnp_CreateDate: nowParts(),
    vnp_ExpireDate: nowParts(15 * 60000), // 15분 후 만료
  };

  const { data, hash } = sign(params, secret);
  return `${gateway}?${data}&vnp_SecureHash=${hash}`;
}

/** 리턴/IPN 콜백 서명 검증 */
export function verifyCallback(query: Record<string, string>) {
  const secret = process.env.VNP_HASH_SECRET!;
  const received = (query.vnp_SecureHash || "").toLowerCase();
  const params = { ...query };
  delete params.vnp_SecureHash;
  delete params.vnp_SecureHashType;
  const { hash } = sign(params, secret);
  return {
    valid: received.length > 0 && received === hash.toLowerCase(),
    success: query.vnp_ResponseCode === "00" && query.vnp_TransactionStatus === "00",
    responseCode: query.vnp_ResponseCode,
    orderNumber: query.vnp_TxnRef,
    amountVnd: Number(query.vnp_Amount || 0) / 100,
  };
}
