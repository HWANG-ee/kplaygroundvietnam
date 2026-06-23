import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import CheckoutForm from "@/components/CheckoutForm";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="container-x py-8">
      <h1 className="text-3xl font-black mb-8">💳 주문/결제</h1>
      <CheckoutForm user={{ name: user.name, mileage: user.mileage }} />
    </div>
  );
}
