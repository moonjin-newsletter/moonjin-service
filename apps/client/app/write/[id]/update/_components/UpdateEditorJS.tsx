"use client";

import EditorJS from "@editorjs/editorjs";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as I from "@components/icons";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CgSpinner } from "react-icons/cg";
import "@components/editorjs/customEditorView.css";
import { type NewsletterAllDataDto } from "@moonjin/api-types";
import {
  EDITOR_JS_I18N,
  EDITOR_JS_TOOLS,
} from "@components/editorjs/customEditorConfig";
import csr from "@lib/fetcher/csr";

export default function UpdateEditorJS({
  letterId,
  letterData,
}: {
  letterId: number;
  letterData: NewsletterAllDataDto;
}) {
  const router = useRouter();
  const [editor, setEditor] = useState<null | EditorJS>(null);
  const {
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    defaultValues: {
      title: letterData.post.title,
    },
  });

  // const { data: seriesList } =
  //   useSWR<ResponseForm<SeriesDto[]>>("series/me/summary");

  register("title", { required: "제목을 입력해주세요" });

  function onClickDelete() {
    if (window.confirm("작성 중인 글을 삭제하시겠습니까?")) {
      csr
        .delete(`newsletter/${letterId}`)
        .then((res) => {
          router.push(`/@${letterData.writer.writerInfo.moonjinId}`);
          router.refresh();
        })
        .catch((err) => toast.error("잠시 후 다시 시도해주세요"));
    }
  }

  function onClickUpdate(value: any) {
    if (editor)
      editor
        .save()
        .then((outputData) => {
          csr
            .patch(`newsletter/${letterId}`, {
              json: {
                title: value.title,
                content: outputData,
              },
            })
            .then((res) => {
              toast.success("글을 저장했습니다");
              router.push(
                `/@${letterData.writer.writerInfo.moonjinId}/post/${letterId}`,
              );
              router.refresh();
            })
            .catch(() => toast.error("글 저장에 실패하였습니다"));
        })
        .catch((error) => {
          console.log("Saving failed: ", error);
        });
  }

  const preventClose = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = "";
  };
  useEffect(() => {
    const editorInstance = new EditorJS({
      holder: "editorjs",
      autofocus: false,
      readOnly: false,
      tools: EDITOR_JS_TOOLS,
      i18n: EDITOR_JS_I18N,
      data: letterData.postContent.content,
      onReady: () => {
        console.log("Editor.js is ready to work!");
      },
    });

    setEditor(editorInstance);

    return () => {
      editorInstance.destroy();
    };
  }, []);

  useEffect(() => {
    (() => {
      window.addEventListener("beforeunload", preventClose);
    })();
    return () => {
      window.removeEventListener("beforeunload", preventClose);
    };
  }, []);

  return (
    <div className=" w-full    flex flex-col items-center">
      <section className="w-full  flex justify-between text-grayscale-600 fixed top-0 py-6 px-8 z-10">
        <a
          href={"/"}
          className="flex items-center font-semibold gap-x-2.5 font-libre"
        >
          <I.LogoIcon width="36" height="36" viewBox="0 0 67 67" /> moonjin
        </a>
        <div className="flex items-center gap-x-4">
          {isSubmitting && (
            <div className="px-4 font-medium text-sm flex items-center gap-x-2 text-grayscale-400">
              <CgSpinner className="animate-spin" /> 저장 중
            </div>
          )}

          <button
            onClick={handleSubmit(onClickUpdate, () => {
              toast.error("제목을 입력해주세요");
            })}
            className="border hover:-translate-y-1 transition duration-300 ease-in-out gap-x-1 flex items-center text-sm font-medium border-primary py-1.5 px-2 text-primary rounded-full"
          >
            <I.Save className="text-primary" />글 수정
          </button>
          <button
            onClick={onClickDelete}
            className="border hover:-translate-y-1 transition duration-300 ease-in-out gap-x-1 flex items-center text-sm font-medium border-grayscale-500 py-1.5 px-2 text-grayscale-500 rounded-full"
          >
            <RiDeleteBin6Line />글 삭제
          </button>
        </div>
      </section>
      <section className="mt-48 max-w-[680px] w-full">
        {letterData.series && (
          <span className="px-4 font-serif text-grayscale-500">
            # {letterData.series.title}
          </span>
        )}

        <input
          type="text"
          {...register("title")}
          placeholder="제목을 입력해주세요"
          maxLength={32}
          className="w-full py-2 font-serif text-grayscale-500 text-2xl outline-none focus:ring-0 border-none"
        />

        <hr className="border border-grayscale-100" />
      </section>
    </div>
  );
}
