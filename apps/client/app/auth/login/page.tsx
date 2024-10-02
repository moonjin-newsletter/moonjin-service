"use client";

import { useForm } from "react-hook-form";
import csr from "../../../lib/fetcher/csr";
import * as process from "process";
import {
  Google,
  Kakao,
  LogoLeft,
  LogoStrokeBlack,
  Naver,
} from "@components/icons";
import Link from "next/link";
import * as Tb from "react-icons/tb";
import Image from "next/image";
import Graphic from "../../../public/static/images/graphic_1.png";
import Header from "@components/layout/Header";

const authUrl = (type: string) => {
  return `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/oauth?social=${type}`;
};

export default function Page() {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onClickLogin(data: any) {
    csr
      .post("auth/login", { json: data })
      .then((res) => {
        window.location.href = "/";
      })
      .catch((err) => alert("로그인 실패"));
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
                className="min-w-[320px] mt-8 flex w-full flex-col  gap-y-4 "
                onSubmit={handleSubmit(onClickLogin)}
              >
                <div>
                  <input
                    type="email"
                    placeholder="이메일"
                    className="w-full h-10 border border-grayscale-200 rounded-lg px-2 placeholder:text-grayscale-400 placeholder:text-sm focus:outline-none"
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
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="비밀번호"
                    className="w-full h-10 border border-grayscale-200 placeholder:text-grayscale-400 rounded-lg px-2 placeholder:text-sm"
                    {...register("password", {
                      required: "비밀번호를 입력해주세요",
                      minLength: 1,
                      maxLength: 16,
                    })}
                  />
                  {errors.password?.message && (
                    <div className="flex items-center mt-1 text-rose-500 gap-x-1">
                      <Tb.TbAlertCircle />
                      <span className="text-xs text-rose-500 ">{`${errors.password?.message}`}</span>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full h-10 rounded-full bg-primary text-white"
                >
                  로그인
                </button>
              </form>

              <div className="flex flex-col justify-center w-full mt-10 text-sm items-center gap-x-2">
                {/*<Link href="/auth/signup">아이디/비밀번호 찾기</Link>*/}
                {/*<div className="w-[1px] h-3 bg-gray-900" />*/}
                <Link
                  href="/auth/signup"
                  className="underline text-grayscale-600"
                >
                  이메일로 회원가입
                </Link>
                {/*<p className="mt-2 font-medium">OR</p>*/}
              </div>
              <div className="flex w-full h-fit mt-4 justify-center gap-x-8 items-center">
                <Link
                  href={authUrl("kakao")}
                  className="h-fit w-fit flex items-center justify-center rounded-full border border-yellow-200 "
                >
                  <Kakao />
                </Link>
                <Link
                  href={authUrl("google")}
                  className="h-fit w-fit flex items-center justify-center rounded-full border border-grayscale-200 "
                >
                  <Google />
                </Link>
                <Link
                  href={authUrl("naver")}
                  className="h-fit w-fit flex items-center justify-center rounded-full border border-green-500 "
                >
                  <Naver />
                </Link>
              </div>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}
