"use client";

import * as I from "components/icons";
import { customEditorJS } from "../../../components/editorjs/customEditor";
import toast from "react-hot-toast";
import { useOverlay } from "@toss/use-overlay";

export default function Page() {
  const editor = customEditorJS();
  const overlay = useOverlay();

  function onClickSave() {
    editor
      .save()
      .then((outputData) => {
        console.log("Article data: ", outputData);
        toast.success("글을 저장했습니다");
      })
      .catch((error) => {
        console.log("Saving failed: ", error);
      });
  }

  function onClickSubmit() {
    editor
      .save()
      .then((outputData) => {
        console.log(outputData);
        overlay.open(({ isOpen }) => {
          return (
            <div
              onClick={(e) => {
                overlay.exit();
              }}
              className="absolute flex items-center justify-center z-50 w-screen h-screen bg-black/40"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-[640px] h-[480px] bg-white"
              ></div>{" "}
            </div>
          );
        });
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
        <button
          onClick={onClickSubmit}
          className="border hover:-translate-y-1 transition duration-300 ease-in-out gap-x-1 flex items-center font-medium border-primary py-1.5 px-2 text-primary rounded-full"
        >
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
