import { LogoSymbolGray } from "@components/icons";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-col flex items-center justify-center w-full h-screen">
      <LogoSymbolGray width="32" height="32" viewBox="0 0 24 24" />
      <span className="text-grayscale-600 mt-4">
        존재하지 않는 작가 또는 게시물 입니다.
      </span>
      <Link
        href={"/"}
        className="py-1.5 px-3 text-sm bg-grayscale-700 text-white rounded mt-2 font-medium"
      >
        홈으로
      </Link>
    </main>
  );
}
