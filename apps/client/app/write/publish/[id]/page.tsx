import Image from "next/image";
import Link from "next/link";
import MailSendingSection from "./MailSendingSection";
import ssr from "../../../../lib/fetcher/ssr";
import type {
  ResponseForm,
  UnreleasedPostWithSeriesDto,
} from "@moonjin/api-types";
import { redirect } from "next/navigation";

type pageProps = {
  params: { id: string };
};

export default async function Page({ params }: pageProps) {
  const letterId = parseInt(params.id, 10);
  const { data: newsletterInfo } = await ssr
    .get(`post/${letterId}/metadata`)
    .then((res) => res.json<ResponseForm<UnreleasedPostWithSeriesDto>>())
    .catch((err) => redirect("/"));

  return (
    <main className="w-full mt-36 min-h-screen flex flex-col items-center ">
      <div className="max-w-[1006px] w-full flex gap-x-10">
        <section className="w-fit flex flex-col h-fit py-5 px-4 bg-grayscale-100 rounded-lg">
          <h2 className="text-lg font-semibold">
            글 상세정보
            <br />
            설정내역
          </h2>
          <ul>
            {[
              {
                tag: "발행 방식",
                content: newsletterInfo?.series
                  ? "[시리즈] " + newsletterInfo.series.title
                  : "자유글",
              },
              { tag: "게시할 뉴스레터명", content: newsletterInfo.post.title },
              { tag: "글 카테고리", content: newsletterInfo.post.category },
              { tag: "썸네일 이미지", content: newsletterInfo.post.cover },
            ].map((value, index) => (
              <>
                {value.tag === "썸네일 이미지" ? (
                  <li className="flex flex-col w-full ">
                    <span className="font-medium mt-8">{value.tag}</span>
                    <Image
                      src={value.content}
                      alt="뉴스레터 썸네일"
                      width={218}
                      height={210}
                      className="w-[218px] min-w-[218px] mt-2 h-[210px] object-cover bg-grayscale-700/80 rounded-lg"
                    />
                  </li>
                ) : (
                  <li className="flex flex-col w-full ">
                    <span className="font-medium mt-8">{value.tag}</span>
                    <div className="mt-2 w-full line-clamp-1 bg-grayscale-200 rounded-lg py-1 px-2">
                      {value.content}
                    </div>
                  </li>
                )}
              </>
            ))}
          </ul>
          <Link
            href={`/write/edit/${letterId}`}
            className="border text-center mt-8 border-grayscale-700 text-grayscale-700 py-2.5 w-full rounded-lg "
          >
            글 상세정보 수정하기
          </Link>
        </section>
        <MailSendingSection
          letterId={letterId}
          letterTitle={newsletterInfo.post.title}
          seriesTitle={newsletterInfo?.series?.title ?? null}
        />
      </div>
    </main>
  );
}
