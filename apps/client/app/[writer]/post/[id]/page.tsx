import EditorRender from "@components/editorjs/EditorRender";
import PostHeader from "../_components/PostHeader";
import Image from "next/image";

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
    {
      type: "delimiter",
      data: {},
    },
    // 추가 블록들...
  ],
  version: "2.22.2",
};

export default async function Page({ params }: pageProps) {
  const [, moonjinId] = decodeURI(params.writer).split("%40");
  const seriesId = parseInt(params.id, 10);

  return (
    <div className="w-full flex flex-col items-center">
      <PostHeader />
      <section className="h-60 w-full relative flex items-center justify-center">
        <Image
          src={""}
          alt={"배너 이미지"}
          className="absolute top-0 left-0 w-full h-full brightness-75 bg-black/80 z-[-1]"
        />
        <div className="flex flex-col items-center text-white">
          <h1 className="font-serif text-2xl font-[300]">
            오타니 쇼헤이와 스포츠경제학
          </h1>
          <div className="border text-[13px] py-1 px-3 border-white/50 text-white/50 rounded-full mt-10">
            수필
          </div>
        </div>
      </section>
      <main className="max-w-[688px]">
        <section className=""></section>
        <EditorRender blocks={editorData.blocks} />
      </main>
    </div>
  );
}
