import HomeTab from "./_components/HomeTab";
import ssr from "../../lib/fetcher/ssr";
import type {
  NewsletterDto,
  ReleasedPostWithWriterDto,
  ResponseForm,
  SeriesWithWriterDto,
} from "@moonjin/api-types";
import { redirect } from "next/navigation";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import { LogoIconGray } from "../../components/icons";

export default async function Page() {
  const userInfo = await ssr("user")
    .then((res) => res.json<any>())
    .catch((err) => redirect("/auth/login"));

  const userType = userInfo?.data?.user?.role === 1 ? "작가" : "독자";

  const seriesList = await ssr("series/following").then((res) =>
    res.json<ResponseForm<SeriesWithWriterDto[]>>(),
  );
  const newsletterList = await ssr("post/newsletter").then((res) =>
    res.json<ResponseForm<ReleasedPostWithWriterDto[]>>(),
  );
  const myNewsletterList =
    userType === "작가"
      ? await ssr("post/me").then((res) =>
          res.json<ResponseForm<NewsletterDto[]>>(),
        )
      : null;

  return (
    <main className="flex flex-col   w-full">
      {userType === "작가" && (
        <Link
          href={""}
          className="flex text-grayscale-600 mb-10 items-center py-3.5 px-3 bg-grayscale-100 rounded-lg"
        >
          <LogoIconGray width="28" height="28" viewBox="0 0 32 32" />
          <span className="ml-2 font-bold text-sm">
            작가님만의 공간을 사색과 경험들로 채워보세요!
          </span>
          <div className="ml-auto flex items-center text-[13px] font-medium">
            작가 공간 바로가기 <IoIosArrowForward />
          </div>
        </Link>
      )}
      <HomeTab
        userType={userType}
        seriesList={seriesList.data}
        newsletterList={newsletterList.data}
        myNewsletterList={myNewsletterList?.data}
      />
    </main>
  );
}
