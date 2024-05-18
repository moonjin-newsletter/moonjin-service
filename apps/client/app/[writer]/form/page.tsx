"use client";
import { Logo, LogoIcon } from "components/icons";
import React from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";

export default function Page() {
  const { setValue, register, handleSubmit, watch } = useForm();

  function onClickSubmit(value: any) {
    return;
  }

  return (
    <main className="w-full min-h-screen flex py-12 flex-col items-center">
      <form
        onSubmit={handleSubmit(onClickSubmit)}
        className="w-full max-w-[400px] px-6 flex flex-col items-center"
      >
        <section className=" w-full">
          <Image
            width={160}
            height={160}
            src=""
            alt="작가 이미지"
            className="rounded-full bg-grayscale-400 mx-auto "
          />
        </section>
        <section className=" flex flex-col items-center mt-8">
          <h1 className="text-grayscale-700/90 text-lg font-semibold font-serif">
            김윤하 작가님을 구독해보세요
          </h1>
          <span className="text-grayscale-700/80 tracking-wide leading-6 text-sm mt-4 font-serif">
            작가님의 한줄 소개입니다. 작가님의 한줄 소개입니다.작가님의 한줄
            소개입니다.작가님의 한줄 소개입니다.작가님의 한줄
            소개입니다.작가님의 한줄 소개입니다.작가님의 한줄
            소개입니다.작가님의 한줄 소개입니다.작가님의 한줄 소개입니다.
          </span>
        </section>
        <section className="flex flex-col mt-5 w-full">
          <label className="">
            이름 <strong className="text-primary">*</strong>
          </label>
          <input
            {...register("1", { required: "이름을 입력해주세요" })}
            type="text"
            maxLength={20}
            placeholder="이름을 입력해주세요"
            className="ring-0 mt-2 w-full h-11 outline-none focus:border-slate-400 focus:ring-0  bg-grayscale-100 border border-grayscale-300 placeholder:text-grayscale-500 rounded"
          />
        </section>
        <section className="flex flex-col mt-4 w-full">
          <label className="">
            이메일 주소 <strong className="text-primary">*</strong>
          </label>
          <input
            {...register("2", { required: "이메일을 입력해주세요" })}
            type="email"
            placeholder="뉴스레터를 받을 이메일을 입력해주세요"
            className="ring-0 mt-2 w-full h-11 outline-none focus:border-slate-400 focus:ring-0  bg-grayscale-100 border border-grayscale-300 placeholder:text-grayscale-500 rounded"
          />
        </section>
        <section className="w-full fixed max-w-[400px] px-6 bottom-0 py-4 mt-6">
          <button
            type="submit"
            className="w-full py-2.5 font-medium bg-primary text-white rounded"
          >
            뉴스레터 구독하기
          </button>
        </section>
        {/*<section className="mt-10 w-full flex flex-col items-center">*/}
        {/*  <LogoIcon width="40" height="40" viewBox="0 0 67 67" />*/}
        {/*  <Logo*/}
        {/*    width="129"*/}
        {/*    height="19"*/}
        {/*    viewBox="0 0 149 39"*/}
        {/*    className="text-primary"*/}
        {/*    fill="#7b0000"*/}
        {/*  />*/}
        {/*</section>*/}
      </form>
    </main>
  );
}
