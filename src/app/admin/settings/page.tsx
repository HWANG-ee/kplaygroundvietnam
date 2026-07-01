import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { getSiteSettings } from "@/lib/settings";
import AdminSettingsForm from "@/components/admin/AdminSettingsForm";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!isAdmin(user.role)) redirect("/admin"); // 매니저는 사이트 설정 불가

  const s = await getSiteSettings();

  return (
    <div className="container-x py-8">
      <Link href="/admin" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] flex items-center gap-1">
        <ArrowLeft size={16} /> 관리자로 돌아가기 / Quay lại quản trị
      </Link>
      <h1 className="text-3xl font-black my-6">⚙️ 사이트 설정 / Cài đặt trang web</h1>
      <p className="text-sm text-[var(--color-muted)] mb-6">
        하단 푸터에 표시되는 회사 정보·고객센터·SNS를 수정합니다. 저장하면 즉시 반영됩니다.
        <br />
        Chỉnh sửa thông tin công ty · CSKH · mạng xã hội ở chân trang. Lưu là áp dụng ngay.
      </p>
      <AdminSettingsForm
        initial={{
          companyName: s.companyName,
          ceo: s.ceo,
          bizNumber: s.bizNumber,
          mailOrderNumber: s.mailOrderNumber,
          address: s.address,
          privacyOfficer: s.privacyOfficer,
          phone: s.phone,
          hours: s.hours,
          instagram: s.instagram,
          youtube: s.youtube,
          twitter: s.twitter,
          announceKo: s.announceKo,
          announceVi: s.announceVi,
          announceEn: s.announceEn,
          heroMainImage: s.heroMainImage,
          heroHotImage: s.heroHotImage,
          heroGoodsImage: s.heroGoodsImage,
        }}
      />
    </div>
  );
}
