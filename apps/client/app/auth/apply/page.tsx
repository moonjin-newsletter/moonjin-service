"use client";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { LogoLeft, LogoStrokeBlack } from "components/icons";
import csr from "../../../lib/fetcher/csr";
import {
  ErrorCodeEnum,
  type ResponseForm,
  UserOrWriterDto,
} from "@moonjin/api-types";
import Image from "next/image";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import Header from "@components/layout/Header";
import Graphic from "../../../public/static/graphic_1.png";

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
      .post("writer", { json: data })
      .then((res) => {
        return router.push("/");
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
    <>
      <Header />
      <main className="flex items-center justify-center w-full h-full min-h-screen bg-grayscale-200 ">
        <section className="w-fit h-fit mt-5 flex items-center bg-white rounded-lg p-10 gap-x-12">
          <div className="flex-1 flex flex-col">
            <div className="w-full">
              <LogoStrokeBlack />
            </div>
            <p className="font-serif flex flex-col mt-4 text-xl">
              <span>그 날의, 어제의,</span>
              <span>오늘의 이야기를</span>
              <span>내일도 기억하기 위해</span>
              <span>문진을 올려주세요.</span>
            </p>
            <p className="text-[13px] text-gray-400 font-light mt-4">
              문진은 매일의 이야기를 소중히 하고,
              <br />
              우리 모두의 현재와 과거의 의미를 깊이 이해합니다.
              <br />
              그리고 미래를 위한 지혜의 도구가 되어드립니다.
            </p>
            <Image
              src={Graphic}
              alt={"문진_로그인"}
              width={380}
              height={240}
              className="mt-6 max-w-[380px]"
            />
          </div>
          <div className="flex-1 flex flex-col h-full">
            <section className="flex flex-col items-center px-10 w-full shadow rounded-lg h-full justify-center py-16">
              <LogoLeft
                width="150"
                height="53"
                viewBox="0 0 161 64"
                className="text-grayscale-600"
              />
              <form
                onSubmit={handleSubmit(onClickSignup)}
                className="w-full min-w-[320px] mt-12 h-fit flex flex-col items-start gap-y-3"
              >
                <div className="flex flex-col w-full">
                  <label htmlFor="nickname" className="text-sm">
                    닉네임
                  </label>
                  <input
                    type="text"
                    id="nickname"
                    placeholder="닉네임"
                    defaultValue={userInfo?.data.user.nickname}
                    className="mt-2 w-full h-10 border border-grayscale-300 rounded-lg px-2 placeholder:text-sm"
                    {...register("nickname", {
                      required: "닉네임을 입력해주세요",
                    })}
                  />
                  {errors.nickname?.message && (
                    <span className="text-xs mt-2 text-rose-500 ">{`${errors.nickname?.message}`}</span>
                  )}
                  <label className="mt-4 text-sm" htmlFor="moonjinId">
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

                  <label className="mt-4 text-sm" htmlFor="description">
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
                  className="mt-4 py-3 disabled:bg-gray-900 w-full rounded-full bg-[#7b0000] text-white"
                >
                  작가 등록하기
                </button>
              </form>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}
