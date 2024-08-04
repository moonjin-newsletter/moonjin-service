import EditorRender from "@components/editorjs/EditorRender";
import PostHeader from "../_components/PostHeader";
import Image from "next/image";
import { LogoSymbolGray } from "@components/icons";
import { nfetch } from "@lib/fetcher/noAuth";
import { NewsletterAllDataDto, ResponseForm } from "@moonjin/api-types";

type pageProps = {
  params: {
    writer: string;
    id: string;
  };
};

const editorData = {
  time: 1635603431943,
  blocks: [
    {
      type: "paragraph",
      data: {
        text: '요즘 구글에서 제공하는 <a target="_blank" href="https://trends.google.co.kr/trends/?geo=KR&amp;hl=ko">Google Trends</a>라는 서비스를 활용하여 다양한 Trend를 알 수 있다. 현재 국내에서 가장 관심있는 키워드가 무엇인지, 특정 검색어의 검색 추이가 어떻게 되는지 등의 정보를 제공한다.',
      },
    },
    {
      type: "paragraph",
      data: {
        text: '요즘 구글에서 제공하는 <a target="_blank" href="https://trends.google.co.kr/trends/?geo=KR&amp;hl=ko">Google Trends</a>라는 서비스를 활용하여 다양한 Trend를 알 수 있다. 현재 국내에서 가장 관심있는 키워드가 무엇인지, 특정 검색어의 검색 추이가 어떻게 되는지 등의 정보를 제공한다.',
      },
    },
    {
      type: "paragraph",
      data: {
        text: '요즘 구글에서 제공하는 <a target="_blank" href="https://trends.google.co.kr/trends/?geo=KR&amp;hl=ko">Google Trends</a>라는 서비스를 활용하여 다양한 Trend를 알 수 있다. 현재 국내에서 가장 관심있는 키워드가 무엇인지, 특정 검색어의 검색 추이가 어떻게 되는지 등의 정보를 제공한다.',
      },
    },
    {
      type: "paragraph",
      data: {
        text: '요즘 구글에서 제공하는 <a target="_blank" href="https://trends.google.co.kr/trends/?geo=KR&amp;hl=ko">Google Trends</a>라는 서비스를 활용하여 다양한 Trend를 알 수 있다. 현재 국내에서 가장 관심있는 키워드가 무엇인지, 특정 검색어의 검색 추이가 어떻게 되는지 등의 정보를 제공한다.',
      },
    },
    {
      type: "paragraph",
      data: {
        text: '요즘 구글에서 제공하는 <a target="_blank" href="https://trends.google.co.kr/trends/?geo=KR&amp;hl=ko">Google Trends</a>라는 서비스를 활용하여 다양한 Trend를 알 수 있다. 현재 국내에서 가장 관심있는 키워드가 무엇인지, 특정 검색어의 검색 추이가 어떻게 되는지 등의 정보를 제공한다.',
      },
    },
    {
      type: "paragraph",
      data: {
        text: '요즘 구글에서 제공하는 <a target="_blank" href="https://trends.google.co.kr/trends/?geo=KR&amp;hl=ko">Google Trends</a>라는 서비스를 활용하여 다양한 Trend를 알 수 있다. 현재 국내에서 가장 관심있는 키워드가 무엇인지, 특정 검색어의 검색 추이가 어떻게 되는지 등의 정보를 제공한다.',
      },
    },
    {
      type: "header",
      data: {
        text: "This is a header",
        level: 2,
      },
    },
    {
      type: "image",
      data: {
        file: {
          url: "https://www.tesla.com/tesla_theme/assets/img/_vehicle_redesign/roadster_and_semi/roadster/hero.jpg",
        },
        caption: "Roadster // tesla.com",
        withBorder: false,
        withBackground: false,
        stretched: false,
      },
    },
    {
      type: "header",
      data: {
        level: 2,
        text: 'Create a directory for your module, enter it and run <u class="cdx-underline">npm init</u> command.',
      },
    },
    {
      type: "list",
      data: {
        style: "ordered",
        items: [
          "이거슨 리스트 아이템이예용",
          "리스트라니까용",
          "간단하고 파워풀하지용",
          "비슷한 설정이 반복되는 게 못생겼어요",
        ],
      },
    },

    // 추가 블록들...
  ],
  version: "2.22.2",
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
      <PostHeader />
      <section className={`h-60 w-full relative  overflow-hidden `}>
        {/*<Image*/}
        {/*  src={nInfo.post.cover}*/}
        {/*  alt={"배너 이미지"}*/}
        {/*  width={1920}*/}
        {/*  height={1080}*/}
        {/*  className="absolute top-0 left-0 w-full h-full brightness-50 bg-black/80 z-[-1] object-cover"*/}
        {/*/>*/}
        <div
          className="w-full h-full bg-cover bg-center flex "
          style={{
            backgroundImage: `url(${nInfo.post.cover})`,
          }}
        >
          <div className="flex flex-col items-center justify-center text-white bg-black/25 w-full h-full">
            <h1 className="font-serif text-2xl font-[300] mt-5">
              테스트입니다
            </h1>
            <div className="border text-[13px] py-1 px-3 border-white/50 text-white/50 rounded-full mt-10">
              카테고리
            </div>
            <div className="flex items-center gap-x-2.5 text-white/50 text-sm my-4">
              <LogoSymbolGray width="16" height="16" viewBox="0 0 24 24" /> 242
            </div>
          </div>
        </div>
      </section>
      <main className="max-w-[688px] w-full py-10">
        <section className="w-full flex flex-col">
          <div className="flex items-center w-full">
            <div className="flex items-center justify-between w-full">
              <p className="font-serif text-sm">
                <span className="text-grayscale-400">by.</span>
                <span>학회원 최진수</span>
                <span className="text-grayscale-400 text-[13px]">
                  {" "}
                  ∙ 2024.08.24
                </span>
              </p>
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
          <div className="mt-5 bg-grayscale-100 rounded-lg p-4 w-full flex items-center ">
            <div className="flex items-center">
              <Image
                src={""}
                alt={"작가 프로필"}
                className="size-12 aspect-square bg-gray-300 rounded-full"
              />
              <div className="flex flex-col ml-3">
                <p className="font-semibold">종이한장</p>
                <span className="text-sm text-grayscale-400">
                  asdf@gmail.com
                </span>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-x-3">
              <span className="text-sm text-grayscale-400">
                구독자 수 | 8.6만명
              </span>
              <button className="py-2 px-4 bg-primary text-white font-medium text-sm rounded-full">
                구독하기
              </button>
            </div>
          </div>
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
