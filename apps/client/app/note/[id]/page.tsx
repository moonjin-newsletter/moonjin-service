"use client";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import * as I from "components/icons";

type pageProps = {
  id: string;
};
export default function Page({ params }: { params: pageProps }) {
  const noteId = parseInt(params.id, 10);

  const editor = new EditorJS({
    holder: "editorjs",
    autofocus: true,
    readOnly: false,
    tools: {
      header: Header,
    },
    data: {
      blocks: [
        {
          type: "header",
          data: {
            text: "이것은 첨부터 보이는 데이터",
            level: 2,
          },
        },
        // {
        //   type: "linkTool",
        //   data: {
        //     link: "https://e-7-e.tistory.com",
        //     meta: {
        //       title: "E7E 만만세",
        //       site_name: "E7E BLOG",
        //       description:
        //         "비오는 날은 언제나, 가슴이 눈물로 가득찬당?, 안찬당?",
        //       image: {
        //         url: "https://wimg.mk.co.kr/news/cms/202304/14/news-p.v1.20230414.15e6ac6d76a84ab398281046dc858116_P1.jpg",
        //       },
        //     },
        //   },
        // },
      ],
    },
    /**
     * Available Tools list.
     * Pass Tool's class or Settings object for each Tool you want to use
     */
    onReady: () => {
      console.log("Editor.js is ready to work!");
    },
  });

  function onClickSave() {
    editor
      .save()
      .then((outputData) => {
        console.log("Article data: ", outputData);
      })
      .catch((error) => {
        console.log("Saving failed: ", error);
      });
  }

  return (
    <main className=" w-full    flex flex-col items-center">
      <section className="mt-12 max-w-[670px] w-full">
        <input
          type="text"
          placeholder="제목을 입력해주세요"
          className="w-full py-4 font-serif text-grayscale-500 text-2xl outline-none focus:ring-0 border-none"
        />
        <hr className="border border-grayscale-100" />
      </section>

      <section className="w-full mt-4 text-grayscale-500">
        <div id="editorjs" className=" w-full"></div>
      </section>
      <section className="w-full gap-x-4 flex justify-end fixed bottom-0 py-6 px-8">
        <button className="border hover:-translate-y-1 transition duration-300 ease-in-out gap-x-1 flex items-center font-medium border-primary py-1.5 px-2 text-primary rounded-full">
          <I.PaperPlaneTilt />글 게시
        </button>
        <button
          onClick={onClickSave}
          className="border hover:-translate-y-1 transition duration-300 ease-in-out gap-x-1 flex items-center font-medium border-grayscale-500 py-1.5 px-2 text-grayscale-500 rounded-full"
        >
          <I.Save />글 저장
        </button>
      </section>
    </main>
  );
}
