import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x py-28 text-center">
      <div className="text-7xl mb-4">🙈</div>
      <h1 className="text-3xl font-black">페이지를 찾을 수 없어요</h1>
      <p className="text-[var(--color-muted)] mt-2">
        주소가 잘못되었거나 삭제된 페이지일 수 있어요.
      </p>
      <Link
        href="/"
        className="inline-block mt-6 px-7 py-3 rounded-full bg-[var(--color-primary)] text-white font-bold"
      >
        홈으로 가기
      </Link>
    </div>
  );
}
