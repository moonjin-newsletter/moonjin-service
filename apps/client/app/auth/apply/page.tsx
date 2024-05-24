"use client";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useEffect } from "react";
import * as I from "components/icons";
import csr from "../../../lib/fetcher/csr";
import {
  ErrorCodeEnum,
  type ResponseForm,
  type UserDto,
  UserOrWriterDto,
  type WriterDto,
} from "@moonjin/api-types";
import Background from "public/images/background.png";
import Image from "next/image";
import Link from "next/link";
import * as Io from "react-icons/io";
import useSWR from "swr";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const { data: userInfo } = useSWR<ResponseForm<UserOrWriterDto>>("user");
  const {
    register,
    setValue,
    resetField,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<any>();

  async function onClickSignup(data: any) {
    await csr
      .post("user/writer", { json: data })
      .then((res) => {
        return router.push("/mypage");
      })
      .catch((err) => {
        if (
          err.code === ErrorCodeEnum.EMAIL_ALREADY_EXIST ||
          err.code === ErrorCodeEnum.NICKNAME_ALREADY_EXIST
        )
          return alert(err.data.message);

        toast.error("작가등록을 실패했습니다");
      });
  }

  return (
    <div className="relative flex items-center justify-center w-full h-full min-h-screen">
      <Image
        className="absolute top-0 left-0 z-0 w-screen h-screen object-cover"
        src={Background}
        alt="백그라운드 이미지"
      />
      <section className="flex-1 z-10 w-1/2 h-full min-h-screen ">
        <div className="text-white flex h-full min-h-screen flex-col pl-20 py-20">
          <I.LogoLeft className="" />
          <div className="font-serif font-semibold mt-8  text-2xl leading-relaxed ">
            일상을 담은 <br />
            다양한 뉴스레터를 <br />
            받아보실 수 있습니다__
          </div>

          <div className="flex text-white mt-auto">
            <Link
              href="/"
              className="flex items-center text-2xl hover hover:translate-x-2 duration-300 transition ease-in-out"
            >
              <Io.IoIosArrowBack />
              <div className="ml-2 text-lg ">홈 바로가기</div>
            </Link>
          </div>
        </div>
      </section>
      <section className="relative z-10  bg-white flex-1 w-1/2 h-full min-h-screen flex flex-col items-center justify-center">
        <div className="  flex w-full max-w-[600px] px-20 gap-y-3 flex-col items-center">
          <h1 className="text-2xl font-bold text-grayscale-700">
            문진 작가 시작하기
          </h1>
          <form
            onSubmit={handleSubmit(onClickSignup)}
            className="w-full mt-12 h-fit flex flex-col items-start gap-y-3"
          >
            <div className="flex flex-col w-full">
              <label htmlFor="nickname">닉네임</label>
              <input
                type="text"
                id="nickname"
                placeholder="닉네임"
                defaultValue={userInfo?.data.user.nickname}
                className="mt-2 w-full h-10 border border-grayscale-300 rounded-lg px-2 placeholder:text-sm"
                {...register("nickname", { required: "닉네임을 입력해주세요" })}
              />
              {errors.nickname?.message && (
                <span className="text-xs mt-2 text-rose-500 ">{`${errors.nickname?.message}`}</span>
              )}
              <label className="mt-4" htmlFor="moonjinId">
                문진 이메일
              </label>
              <div className="flex items-center gap-x-2.5">
                <input
                  id="moonjinId"
                  type="text"
                  placeholder="이메일"
                  className="mt-2 w-full max-w-[180px] h-10 border border-grayscale-300 rounded-lg px-2 placeholder:text-sm"
                  {...register("moonjinId", {
                    required: "이메일을 입력해주세요",
                  })}
                />
                <span className="text-grayscale-500">@moonjin.site</span>
              </div>
              {errors.email?.message && (
                <span className="text-xs mt-2 text-rose-500 ">{`${errors.email?.message}`}</span>
              )}

              <label className="mt-4" htmlFor="description">
                작가 소개
              </label>
              <input
                id="description"
                type="text"
                maxLength={120}
                placeholder="간단한 작가소개를 적어주세요"
                className="mt-2 w-full  h-10 border border-grayscale-300 rounded-lg px-2 placeholder:text-sm"
                {...register("description", {
                  maxLength: 120,
                })}
              />
              {errors.description?.message && (
                <span className="text-xs mt-2 text-rose-500 ">
                  120자 이내로 작가소개를 작성해주세요
                </span>
              )}
            </div>
            <button
              type="submit"
              className="mt-2 py-3 disabled:bg-gray-900 w-full rounded-3xl bg-[#7b0000] text-white"
            >
              작가 등록하기
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
