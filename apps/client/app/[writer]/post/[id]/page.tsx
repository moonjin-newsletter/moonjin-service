import EditorRender from "@components/editorjs/EditorRender";
import PostHeader from "../_components/PostHeader";
import Image from "next/image";
import { LogoSymbolGray } from "@components/icons";
import { nfetch } from "@lib/fetcher/noAuth";
import {
  NewsletterAllDataDto,
  NewsletterCardDto,
  ResponseForm,
  type SubscribingResponseDto,
} from "@moonjin/api-types";
import { format } from "date-fns";
import Link from "next/link";
import { formatNumberKo } from "@utils/formatNumber";
import { range } from "@toss/utils";
import ssr from "@lib/fetcher/ssr";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import SubModalProvider from "@components/modal/SubModalProvider";
import LikeButton from "./_components/LikeButton";

type pageProps = {
  params: {
    writer: string;
    id: string;
  };
};

export const revalidate = 0;

export default async function Page({ params }: pageProps) {
  const [, moonjinId] = decodeURI(params.writer).split("%40");
  const nId = parseInt(params.id, 10);

  const { data: nInfo } = await nfetch<ResponseForm<NewsletterAllDataDto>>(
    `writer/${moonjinId}/newsletter/${nId}`,
  );
  const { data: relatedPosts } = await nfetch<
    ResponseForm<NewsletterCardDto[]>
  >(`newsletter/${nId}/recommend/all?take=9`);

  const isLogin = cookies().get("accessToken");
  const { data: subInfo } = isLogin
    ? await ssr(`subscribe/moonjinId/${moonjinId}`)
        .json<ResponseForm<SubscribingResponseDto>>()
        .catch(() => redirect("/auth/login"))
    : { data: null };

  return (
    <div className="w-full flex flex-col items-center">
      <PostHeader nInfo={nInfo} />

      <main className="max-w-[688px] w-full pt-20 pb-10">
        <section className="flex w-full flex-col">
          <div className="w-full">
            <div className="py-1 px-3 rounded-full bg-primary/5 text-primary w-fit text-sm">
              {nInfo.post.category}
            </div>
          </div>
          <h1 className="text-2xl font-medium mt-4 font-serif ">
            {nInfo.post.title}
          </h1>

          <div className="flex items-center w-full mt-8">
            <div className="flex items-center justify-between w-full">
              <p className="font-serif text-sm">
                <span className="text-grayscale-400">by.</span>
                <Link
                  className="hover:underline"
                  href={`/@${nInfo.writer.writerInfo.moonjinId}`}
                >
                  {nInfo.writer.user.nickname}
                </Link>
                <span className="text-grayscale-400 text-[13px]">
                  {" "}
                  ∙ {format(new Date(nInfo.newsletter.sentAt), "yyyy.MM.dd")}
                </span>
              </p>
              <div className="flex items-center gap-x-2">
                <div className="text-xs  rounded-full py-1.5 px-4 flex items-center gap-x-2 text-grayscale-500 border-grayscale-300">
                  <LogoSymbolGray width="20" height="20" viewBox="0 0 24 24" />{" "}
                  {nInfo.newsletter.likes}
                </div>
                <SubModalProvider
                  subInfo={subInfo}
                  writerInfo={nInfo.writer}
                  subChildren={
                    <div className="py-2 rounded-full px-4 border border-primary text-primary text-xs font-medium">
                      구독하기
                    </div>
                  }
                  unSubChildren={
                    <div className="py-2 rounded-full px-4 border border-primary text-primary text-xs font-medium">
                      구독중
                    </div>
                  }
                />
              </div>
            </div>
          </div>
          {nInfo?.series && (
            <Link
              className="flex mt-5 items-center justify-between w-full gap-x-[200px] bg-grayscale-100 rounded-lg py-4 px-6"
              href={`/@${nInfo.writer.writerInfo.moonjinId}/series/${nInfo.series.id}`}
            >
              <div className="flex flex-col gap-y-1.5">
                <h2 className="text-lg underline font-semibold  cursor-pointer">
                  {nInfo.series.title}
                </h2>
                <span className="line-clamp-1 text-grayscale-400 text-[13px]">
                  {nInfo.series.description}
                </span>
              </div>
              <div className="flex gap-x-4">
                <div className="flex gap-x-1">
                  {range(0, 5).map((index) => (
                    <div
                      key={index}
                      className="size-5 rounded border border-primary aspect-square bg-white/90 "
                    />
                  ))}
                </div>
                <Image
                  src={nInfo.series.cover}
                  alt={"시리즈 커버"}
                  width={68}
                  height={68}
                  className="w-[68px] aspect-square min-w-[68px] rounded"
                />
              </div>
            </Link>
          )}
        </section>
        <hr className="mt-4 mb-10" />
        {/*뉴스레터 영역*/}
        <EditorRender blocks={nInfo.postContent.content.blocks} />
        <section className="flex flex-col mt-10 w-full">
          <div className="flex items-center justify-between w-full ">
            <span className="text-sm text-grayscale-400 ">
              이번 글은 어떠셨나요? 글이 마음에 드셨다면 문진을 올려주세요
            </span>
            <LikeButton nId={nId} />
          </div>
          <div className="mt-5 bg-grayscale-100 rounded-lg p-4 w-full flex items-center ">
            <Link
              href={`/@${nInfo.writer.writerInfo.moonjinId}`}
              className="flex items-center"
            >
              <Image
                src={nInfo.writer.user.image}
                width={48}
                height={48}
                alt={"작가 프로필"}
                className="size-12 aspect-square  rounded-full bg-white"
              />
              <div className="flex flex-col ml-3">
                <p className="font-semibold">{nInfo.writer.user.nickname}</p>
                <span className="text-sm text-grayscale-400">
                  {nInfo.writer.writerInfo.moonjinId}@moonjin.site
                </span>
              </div>
            </Link>
            <div className="ml-auto flex items-center gap-x-3">
              <span className="text-sm text-grayscale-400">
                구독자 수 |{" "}
                {formatNumberKo(nInfo.writer.writerInfo.followerCount)}
              </span>
              <SubModalProvider
                subInfo={subInfo}
                writerInfo={nInfo.writer}
                subChildren={
                  <div className="py-2 px-4 bg-primary text-white font-medium text-sm rounded-full">
                    구독하기
                  </div>
                }
                unSubChildren={
                  <div className="py-2 px-4 bg-primary text-white font-medium text-sm rounded-full">
                    구독중
                  </div>
                }
              />
            </div>
          </div>
        </section>
        <hr className="my-10" />
        <section className="flex flex-col">
          <span className="text-lg font-bold">
            방금 읽은 글과 유사한 글을 읽어보세요.
          </span>
          <div className="grid grid-cols-3 gap-x-4 gap-y-6 mt-5">
            {relatedPosts.map((relatedPost) => (
              <RelatedPostCard key={relatedPost.post.id} pInfo={relatedPost} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function RelatedPostCard({ pInfo }: { pInfo: NewsletterCardDto }) {
  return (
    <Link href={`/@${pInfo.writer.moonjinId}/newsletter/${pInfo.post.id}`}>
      <div className="flex flex-col gap-y-2">
        <div className="size-fit max-w-[212px] max-h-[212px] bg-gray-300 rounded-lg border overflow-hidden">
          <Image
            src={pInfo.post.cover}
            alt="커버 이미지"
            className="rounded-lg aspect-square object-cover"
            width={212}
            height={212}
          />
        </div>
        <h3 className=" font-semibold line-clamp-1">{pInfo.post.title}</h3>
        <p className="line-clamp-1 text-grayscale-500 text-sm">
          {pInfo.post.preview}
        </p>
        <div className="flex items-center">
          {/*<Image*/}
          {/*  src={pInfo.writer.image}*/}
          {/*  alt={"작가 이미지"}*/}
          {/*  width={24}*/}
          {/*  height={24}*/}
          {/*  className="rounded-full"*/}
          {/*/>*/}
          <span className="text-sm text-grayscale-500 ">
            By.{pInfo.writer.nickname}
          </span>
        </div>
      </div>
    </Link>
  );
}
