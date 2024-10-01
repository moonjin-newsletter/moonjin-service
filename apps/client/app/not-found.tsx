import { LogoSymbolGray } from "@components/icons";

export default function Page() {
  return (
    <main className="flex-col flex items-center justify-center w-full h-screen">
      <LogoSymbolGray width="32" height="32" viewBox="0 0 24 24" />
      <span className="text-grayscale-600 mt-4">
        서비스 오류 발생, 문진을 통해 문의해주세요.
      </span>
    </main>
  );
}
