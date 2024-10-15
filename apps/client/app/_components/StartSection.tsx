import { Graphic1, LogoSymbolGray } from "@components/icons";
import Link from "next/link";
import checkLogin from "@utils/checkLogin";
import ssr from "@lib/fetcher/ssr";
import { checkType } from "@utils/checkUser";
import type { ResponseForm, UserOrWriterDto } from "@moonjin/api-types";

export default async function StartSection() {
  const userInfo = checkLogin()
    ? await ssr("user").json<ResponseForm<UserOrWriterDto>>()
    : null;

  return (
    <section className="flex pt-44  flex-col  items-center w-full pb-40 max-w-[1006px]">
      <div className="flex flex-col items-center text-center">
        <Graphic1 />
        <span className="text-sm mt-6 font-serif text-primary">
          오늘 어떤 하루를 보내셨나요?
        </span>
        <span className="mt-4 text-xl font-medium text-grayscale-700 font-serif">
          문진의 작가가 되어 삶의 이야기를 기록하고
          <br />
          흩날리지 않게 문진을 올려주세요.
        </span>
        {!userInfo ? (
          <Link
            href={"/auth/login"}
            className="py-2.5 px-6 bg-grayscale-600 text-white rounded-lg mt-10 flex items-center gap-x-1.5"
          >
            <LogoSymbolGray />
            문진 시작하기
          </Link>
        ) : checkType(userInfo.data.user.role) === "작가" ? (
          <Link
            href={"/write/new"}
            className="py-2.5 px-6 bg-grayscale-600 text-white rounded-lg mt-10 flex items-center gap-x-1.5"
          >
            <LogoSymbolGray />
            문진 글쓰기
          </Link>
        ) : (
          <Link
            href={"/auth/apply"}
            className="py-2.5 px-6 bg-grayscale-600 text-white rounded-lg mt-10 flex items-center gap-x-1.5"
          >
            <LogoSymbolGray />
            작가 시작하기
          </Link>
        )}
      </div>
    </section>
  );
}
