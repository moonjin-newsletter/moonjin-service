"use client";

import Link from "next/link";
import * as Io from "react-icons/io";
import { useForm } from "react-hook-form";
import csr from "../../../../../lib/fetcher/csr";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { ICreateLetter } from "@moonjin/api-types";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const receiver = searchParams.get("receiver");
  const {
    formState: { errors },
    handleSubmit,
    setValue,
    register,
  } = useForm();

  function onClickSubmit(value: any) {
    csr
      .post("letter", { json: value })
      .then((res) => {
        toast.success("편지 전송을 완료했습니다");
        router.push("/mypage/letter");
      })
      .catch((err) => toast.error("편지 전송에 실패하였습니다"));
  }

  useEffect(() => {
    if (receiver) setValue("receiverEmail", receiver);
  }, []);

  return (
    <main className="overflow-hidden w-full max-w-[748px] flex flex-col">
      <Link
        href="/mypage/letter"
        className="w-fit pr-4 py-2 text-grayscale-600 flex items-center gap-x-2.5"
      >
        <Io.IoIosArrowBack /> 뒤로가기
      </Link>
      <form
        onSubmit={handleSubmit(onClickSubmit)}
        className="mt-8 flex flex-col"
      >
        <div className="flex w-full  items-center pb-4 border-b  border-grayscale-200 outline-none">
          <label
            className="text-grayscale-700 whitespace-nowrap font-semibold"
            style={{ outline: "none" }}
          >
            제목
          </label>
          <input
            {...register("title", { required: "제목을 작성해주세요" })}
            maxLength={64}
            placeholder="제목을 입력해주세요"
            type="text"
            className="ml-4 w-full focus:ring-0 border-0 outline-none "
          />
        </div>
        <div className="flex items-center py-5 gap-y-2 border-b border-grayscale-200">
          <label className="text-grayscale-700 whitespace-nowrap font-semibold">
            받는 사람
          </label>
          <input
            {...register("receiverEmail", { required: "제목을 작성해주세요" })}
            placeholder="letter@moonjin.site"
            type="email"
            className="ml-4 focus:ring-0 min-w-[400px] border-0 outline-none "
          />
        </div>
        <textarea
          {...register("content", {
            required: "본문을 작성해주세요",
            maxLength: 2048,
          })}
          className="resize-none w-full border-none  whitespace-pre-wrap outline-none focus:ring-0 ring-0 min-h-[500px] bg-grayscale-100 px-5 py-8"
        />
        <button
          type="submit"
          className=" py-2.5 px-10 h-full  bg-primary text-white w-fit ml-auto mt-8 rounded"
        >
          전송하기
        </button>
      </form>
    </main>
  );
}
