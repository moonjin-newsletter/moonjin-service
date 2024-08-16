import Image from "next/image";
import type {
  ResponseForm,
  SubscribingResponseDto,
  WriterPublicCardDto,
} from "@moonjin/api-types";
import { commaizeNumber } from "@toss/utils";
import SubModalProvider from "@components/modal/SubModalProvider";
import MoreButton from "./MoreButton";
import { formatNumberKo } from "@utils/formatNumber";
import { cookies } from "next/headers";
import ssr from "@lib/fetcher/ssr";
import { redirect } from "next/navigation";

export default async function WriterProfile({
  writerInfo,
}: {
  writerInfo: WriterPublicCardDto;
}) {
  const isLogin = cookies().get("accessToken");
  // const subInfo = null;

  const { data: subInfo } = isLogin
    ? await ssr(`subscribe/moonjinId/${writerInfo.writerInfo.moonjinId}`)
        .json<ResponseForm<SubscribingResponseDto>>()
        .catch(() => redirect("/auth/login"))
    : { data: null };

  return (
    <header className="w-full h-[200px]  flex items-center gap-x-10">
      <Image
        src={writerInfo.user.image}
        alt={`작가 프로필 이미지: ${writerInfo.user.nickname}`}
        width={200}
        height={200}
        className="w-[200px] min-w-[200px] h-[200px] object-cover bg-grayscale-200 rounded-lg  overflow-hidden shadow"
      />
      <div className="flex grow flex-col w-full h-full">
        <h1 className="text-[28px] font-semibold">
          {writerInfo.user.nickname}
        </h1>
        <strong className="text-primary font-normal ">
          {writerInfo.writerInfo.moonjinId}@moonjin.site
        </strong>
        <span className="line-clamp-3 flex grow items-center mt-4 text-grayscale-500 text-sm leading-5 ">
          {writerInfo.user.description}
        </span>
        <div className="flex items-center mt-4 justify-between w-full">
          <div className="flex gap-x-4">
            {[
              {
                head: "구독자",
                body: formatNumberKo(writerInfo.writerInfo.followerCount),
              },
              { head: "뉴스레터", body: writerInfo.writerInfo.newsletterCount },
              { head: "시리즈", body: writerInfo.writerInfo.seriesCount },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-x-1.5">
                <span className="text-grayscale-500 font-light">
                  {item.head}
                </span>
                <span className="">{commaizeNumber(item.body)}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-x-2.5">
            <SubModalProvider
              subInfo={subInfo}
              writerInfo={writerInfo}
              subChildren={
                <div className="py-2 px-4 rounded-full text-sm bg-grayscale-600 text-white">
                  구독하기
                </div>
              }
              unSubChildren={
                <div className="py-2 px-4 rounded-full text-sm bg-primary text-white">
                  구독 중
                </div>
              }
            />
            <MoreButton writerInfo={writerInfo} />
          </div>
        </div>
      </div>
    </header>
  );
}
