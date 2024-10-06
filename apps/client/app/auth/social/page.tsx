"use client";
import { useForm } from "react-hook-form";
import React, { useEffect } from "react";
import { LogoLeft, LogoStrokeBlack } from "components/icons";
import csr from "../../../lib/fetcher/csr";
import { ErrorCodeEnum } from "@moonjin/api-types";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import * as Tb from "react-icons/tb";
import Header from "@components/layout/Header";
import Graphic from "../../../public/static/images/graphic_1.png";
import toast from "react-hot-toast";

export default function Page() {
  const params = useSearchParams();

  const {
    register,
    setValue,
    resetField,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<any>();
  const role = watch("role");

  async function onClickSignup(data: any) {
    if (data.termsCheck !== true) return toast.error("약관에 동의해주세요");

    const auth = {
      ...data,
      role: parseInt(data.role),
    };

    await csr
      .post("auth/oauth/signup", { json: auth })
      .then((res) => {
        window.location.href = "/";
      })
      .catch((err) => {
        if (err.code === ErrorCodeEnum.EMAIL_ALREADY_EXIST)
          return alert(err.data.message);
        alert("회원가입 실패");
      });
  }

  useEffect(() => {
    resetField("moonjinId");
    setValue("email", params.get("email"));
  }, [role]);

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
                className="w-[360px] h-fit flex flex-col items-start  max-w-[360px]"
              >
                <div className="w-full flex mt-4 flex-col">
                  <span className="text-sm">회원구분</span>
                  <div className="flex mt-2 w-full items-center gap-x-3">
                    <div className="flex items-center gap-x-2">
                      <input
                        {...register("role", {
                          required: "이메일을 입력해주세요",
                        })}
                        id="0"
                        type="radio"
                        name="role"
                        defaultChecked={true}
                        value={0}
                        className="w-4 h-4 text-[#7b0000]  border-4 border-gray-400 focus:ring-[#7b0000] dark:focus:ring-[#7b0000] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="0" className="text-sm text-grayscale-600">
                        독자 회원
                      </label>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <input
                        {...register("role", {
                          required: "이메일을 입력해주세요",
                        })}
                        id="1"
                        type="radio"
                        name="role"
                        value={1}
                        className="w-4 h-4 text-[#7b0000]  border-4 border-gray-400 focus:ring-[#7b0000] dark:focus:ring-[#7b0000] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label htmlFor="1" className="text-sm text-grayscale-600">
                        작가 회원
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex  flex-col w-full">
                  <label htmlFor="nickname" className="text-sm mt-4">
                    닉네임
                  </label>
                  <input
                    type="text"
                    id="nickname"
                    placeholder="닉네임"
                    className="mt-2 w-full h-10 border border-grayscale-300 rounded-lg px-2 placeholder:text-sm"
                    {...register("nickname", {
                      required: "닉네임을 입력해주세요",
                    })}
                  />
                  {errors.nickname?.message && (
                    <div className="flex mt-1 items-center  text-rose-500 gap-x-1">
                      <Tb.TbAlertCircle />
                      <span className="text-xs text-rose-500 ">{`${errors.nickname?.message}`}</span>
                    </div>
                  )}
                  <label className="mt-4 text-sm" htmlFor="email">
                    이메일
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="이메일"
                    disabled={true}
                    defaultValue={"andy6239@gmail.com"}
                    className="mt-2 w-full h-10 border border-grayscale-300 rounded-lg px-2 placeholder:text-sm"
                    {...register("email", {
                      required: "이메일을 입력해주세요",
                    })}
                  />
                  {errors.email?.message && (
                    <div className="flex items-center mt-1 text-rose-500 gap-x-1">
                      <Tb.TbAlertCircle />
                      <span className="text-xs text-rose-500 ">{`${errors.email?.message}`}</span>
                    </div>
                  )}

                  {role === "1" ? (
                    <div className="w-full mt-4">
                      <label htmlFor="moonjinId" className="text-sm">
                        문진 이메일
                      </label>
                      <div className="mt-2 flex items-center text-gray-800">
                        <input
                          id="moonjinId"
                          type="text"
                          placeholder="문진 이메일 아이디"
                          className=" w-2/5 h-10 border border-grayscale-300 rounded-lg px-2 placeholder:text-sm"
                          {...register("moonjinId", {
                            required: "레터를 발송할 이메일을 입력해주세요",
                          })}
                        />
                        <span className="ml-1.5 font-medium text-grayscale-500">
                          @ moonjin.site
                        </span>
                      </div>
                      {errors.moonjinId?.message && (
                        <div className="flex items-center mt-1 text-rose-500 gap-x-1">
                          <Tb.TbAlertCircle />
                          <span className="text-xs text-rose-500 ">{`${errors.moonjinId?.message}`}</span>
                        </div>
                      )}
                    </div>
                  ) : null}
                  <div className="flex items-center mt-4">
                    <input
                      id="termsCheck"
                      type="checkbox"
                      {...register("termsCheck", {
                        required: "약관에 동의해주세요",
                      })}
                      className="w-4 h-4 text-primary  border-gray-400 focus:ring-0  dark:bg-gray-700 rounded"
                    />
                    <label
                      htmlFor="termsCheck"
                      className="text-sm ml-2 text-grayscale-600"
                    >
                      문진&nbsp;
                      <a
                        href="https://moonjin.notion.site/10a8d6d4b48880b6ba63dc497909a933"
                        className="underline"
                      >
                        이용약관
                      </a>
                      &nbsp;및&nbsp;
                      <a
                        href="https://moonjin.notion.site/10a8d6d4b4888066b283d6ab924da055"
                        className="underline"
                      >
                        개인정보 처리방침
                      </a>
                      에 동의합니다.
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-4 disabled:bg-gray-900 w-full h-10 rounded-full bg-[#7b0000] text-white"
                >
                  회원가입
                </button>
              </form>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}
