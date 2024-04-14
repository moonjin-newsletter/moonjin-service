"use client";

import * as I from "components/icons";
import { customEditorJS } from "../../../components/editorjs/customEditor";
import toast from "react-hot-toast";
import { useOverlay } from "@toss/use-overlay";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

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
        overlay.open(({ isOpen }) => {
          return <OverlaySetting overlay={overlay} outputData={outputData} />;
        });
      })
      .catch((error) => {
        console.log("Saving failed: ", error);
      });
  }

  // const preventClose = (e: BeforeUnloadEvent) => {
  //   e.preventDefault();
  //   e.returnValue = "";
  // };
  // useEffect(() => {
  //   (() => {
  //     window.addEventListener("beforeunload", preventClose);
  //   })();
  //   return () => {
  //     window.removeEventListener("beforeunload", preventClose);
  //   };
  // }, []);

  return (
    <main className=" w-full    flex flex-col items-center">
      <section className="w-full  flex justify-between text-grayscale-600 fixed top-0 py-6 px-8">
        <a
          href={"/"}
          className="flex items-center font-semibold gap-x-2.5 font-libre"
        >
          <I.LogoIcon width="36" height="36" viewBox="0 0 67 67" /> moonjin
        </a>
        <div className="flex items-center gap-x-4">
          <button
            onClick={onClickSubmit}
            className="border hover:-translate-y-1 transition duration-300 ease-in-out gap-x-1 flex items-center text-sm font-medium border-primary py-1.5 px-2 text-primary rounded-full"
          >
            <I.PaperPlaneTilt />글 게시
          </button>
          <button
            onClick={onClickSave}
            className="border hover:-translate-y-1 transition duration-300 ease-in-out gap-x-1 flex items-center text-sm font-medium border-grayscale-500 py-1.5 px-2 text-grayscale-500 rounded-full"
          >
            <I.Save />글 저장
          </button>
        </div>
      </section>
      <section className="mt-48 max-w-[680px] w-full">
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
    </main>
  );
}

function OverlaySetting({
  overlay,
  outputData,
}: {
  overlay: any;
  outputData: any;
}) {
  const { register, handleSubmit, watch } = useForm();

  function onClickSave() {
    console.log("save");
  }

  return (
    <div
      onClick={(e) => {
        overlay.exit();
      }}
      className="absolute flex items-center justify-center z-50 w-screen h-screen bg-black/40"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[600px] py-8 px-8 rounded-lg bg-white"
      >
        <h1 className="text-lg font-semibold">뉴스레터 정보</h1>

        <section className="mt-8">
          <label>작성하신 글의 종류를 선택해주세요</label>
          <ul className="text-sm text-grayscale-600 mt-2 flex items-center gap-x-6 ">
            <li className="flex items-center gap-x-2.5">
              <input {...register("type")} id="type" type="radio" />
              <span>자유글</span>
            </li>
            <li className="flex items-center gap-x-2.5">
              <input {...register("type")} id="type" type="radio" />
              <span>시리즈</span>
            </li>
          </ul>
        </section>
        <section className="mt-8">
          <label>작성하신 글의 종류를 선택해주세요</label>
          <ul className="text-sm text-grayscale-600 mt-2 flex flex-col gap-y-2.5 ">
            <li className="flex items-center gap-x-2.5">
              <input {...register("category")} id="category" type="radio" />
              <span>시・수필</span>
            </li>
            <li className="flex items-center gap-x-2.5">
              <input {...register("category")} id="category" type="radio" />
              <span>에세이</span>
            </li>
            <li className="flex items-center gap-x-2.5">
              <input {...register("category")} id="category" type="radio" />
              <span>소설</span>
            </li>
            <li className="flex items-center gap-x-2.5">
              <input {...register("category")} id="category" type="radio" />
              <span>평론</span>
            </li>
            <li className="flex items-center gap-x-2.5">
              <input {...register("category")} id="category" type="radio" />
              <span>기타</span>
            </li>
          </ul>
        </section>
      </div>{" "}
    </div>
  );
}
