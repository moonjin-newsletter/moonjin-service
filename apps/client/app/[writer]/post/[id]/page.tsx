import EditorRender from "@components/editorjs/EditorRender";
import PostHeader from "../_components/PostHeader";
import Image from "next/image";
import { LogoSymbolGray } from "@components/icons";
import { nfetch } from "@lib/fetcher/noAuth";
import { NewsletterAllDataDto, ResponseForm } from "@moonjin/api-types";
import { format } from "date-fns";
import Link from "next/link";
import { formatNumberKo } from "@utils/formatNumber";

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

  return (
    <div className="w-full flex flex-col items-center">
      <PostHeader nInfo={nInfo} />
      <section className={`h-60 w-full relative  overflow-hidden `}>
        <div
          className="w-full h-full bg-cover bg-center flex "
          style={{
            backgroundImage: `url(${nInfo.post.cover})`,
          }}
        >
          <div className="flex flex-col items-center justify-center text-white bg-grayscale-700/40 w-full h-full">
            <div className="flex items-center mt-10 gap-x-3">
              <div className="border text-[13px] py-1 px-3 border-grayscale-200 text-grayscale-200 rounded-full ">
                {nInfo.post.category}
              </div>
              <p className="font-serif text-grayscale-200 text-sm whitespace-nowrap">
                <span className="">by.</span>
                <strong>{nInfo.writer.nickname}</strong>
                <span className="text-[13px]">
                  {" "}
                  ∙ {format(new Date(nInfo.newsletter.sentAt), "yyyy.MM.dd")}
                </span>
              </p>
            </div>
            <h1 className="font-serif text-2xl font-[300] mt-5">
              {nInfo.post.title}
            </h1>

            <div className="flex border border-grayscale-200 items-center gap-x-2.5 text-grayscale-200 text-sm my-4">
              <LogoSymbolGray width="16" height="16" viewBox="0 0 24 24" />{" "}
              {nInfo.newsletter.likes}
            </div>
          </div>
        </div>
      </section>
      <main className="max-w-[688px] w-full py-10">
        <section className="w-full flex flex-col">
          <div className="flex items-center w-full">
            <div className="flex items-center justify-between w-full">
              <button className="py-2 rounded-full px-4 border border-primary text-primary text-xs font-medium">
                구독하기
              </button>
            </div>
          </div>
        </section>
        <hr className="my-10" />
        <EditorRender blocks={nInfo.postContent.content.blocks} />
        <section className="flex flex-col mt-10 w-full">
          <div className="flex items-center justify-between w-full">
            <span className="text-sm text-grayscale-400 ">
              이번 글은 어떠셨나요? 글이 마음에 드셨다면 문진을 올려주세요
            </span>
            <button className="text-sm border rounded-full py-1.5 px-4 flex items-center gap-x-2 text-grayscale-500 border-grayscale-300">
              <LogoSymbolGray width="20" height="20" viewBox="0 0 24 24" />{" "}
              올려두기
            </button>
          </div>
          <Link
            href={`/@${nInfo.writer.moonjinId}`}
            className="mt-5 bg-grayscale-100 rounded-lg p-4 w-full flex items-center "
          >
            <div className="flex items-center">
              <Image
                src={""}
                alt={"작가 프로필"}
                className="size-12 aspect-square bg-gray-300 rounded-full"
              />
              <div className="flex flex-col ml-3">
                <p className="font-semibold">{nInfo.writer.nickname}</p>
                <span className="text-sm text-grayscale-400">
                  {nInfo.writer.moonjinId}@moonjin.site
                </span>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-x-3">
              <span className="text-sm text-grayscale-400">
                구독자 수 | {formatNumberKo(4143)}
              </span>
              <button className="py-2 px-4 bg-primary text-white font-medium text-sm rounded-full">
                구독하기
              </button>
            </div>
          </Link>
        </section>
        <hr className="my-10" />
        <section className="flex flex-col">
          <span className="text-lg font-bold">
            방금 읽은 글과 유사한 글을 읽어보세요.
          </span>
        </section>
      </main>
    </div>
  );
}
