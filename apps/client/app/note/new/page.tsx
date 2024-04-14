"use client";

import * as I from "components/icons";
import { customEditorJS } from "../../../components/editorjs/customEditor";

export default function Page() {
  const editor = customEditorJS();

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
      <section className="mt-24 max-w-[680px] w-full">
        <input
          type="text"
          placeholder="제목을 입력해주세요"
          className="w-full py-4 font-serif text-grayscale-500 text-2xl outline-none focus:ring-0 border-none"
        />
        <hr className="border border-grayscale-100" />
      </section>

      <section className="w-full max-w-[670px] mt-4 text-grayscale-500">
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
