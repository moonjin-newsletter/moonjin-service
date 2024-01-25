"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import * as I from "components/icons";
import toast from "react-hot-toast";
import csr from "../../../lib/fetcher/csr";
import { useRouter } from "next/router";
import Image from "next/image";
import Background from "public/images/background.png";
import * as process from "process";

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
    <div className="flex items-center justify-center w-full h-full min-h-screen">
      <Image
        className="absolute top-0 left-0 z-0 w-screen h-screen object-cover"
        src={Background}
        alt="백그라운드 이미지"
      />
      <section className="flex-1 z-10 w-1/2 h-full min-h-screen px-20 py-12">
        <div className="text-white font-serif">
          Series : 작가들이 보내는 <br />다 다양한 시리즈물을 <br />
          받아보실 수 있습니다
        </div>
      </section>
      <section className="z-10  bg-white flex-1 w-1/2 h-full min-h-screen flex flex-col items-center justify-center">
        <I.AuthLogo />

        <section className="flex flex-col items-center px-10 w-full">
          <form
            className="max-w-[320px] mt-8 flex w-full flex-col  gap-y-4"
            onSubmit={handleSubmit(onClickLogin)}
          >
            <input
              type="email"
              placeholder="이메일"
              className="w-full h-10 border rounded-lg px-2 placeholder:text-sm"
              {...register("email", { required: "이메일을 입력해주세요" })}
            />
            {errors.email?.message && (
              <span className="text-xs text-rose-500 ">{`${errors.email?.message}`}</span>
            )}
            <input
              type="password"
              placeholder="비밀번호"
              className="w-full h-10 border rounded-lg px-2 placeholder:text-sm"
              {...register("password", {
                required: "비밀번호를 입력해주세요",
                minLength: 1,
                maxLength: 16,
              })}
            />
            {errors.password?.message && (
              <span className="text-xs text-rose-500 ">{`${errors.password?.message}`}</span>
            )}
            <button
              type="submit"
              className="w-full h-10 rounded-2xl bg-primary text-white"
            >
              로그인
            </button>
          </form>

          <div className="flex justify-center w-full mt-10 text-sm items-center gap-x-2">
            <Link href="/auth/signup">아이디/비밀번호 찾기</Link>
            <div className="w-[1px] h-3 bg-gray-900" />
            <Link href="/auth/signup">회원가입</Link>
          </div>
          <div className="flex w-full h-fit mt-4 justify-center gap-x-8 items-center">
            <Link
              href={`${
                process.env.NEXT_PUBLIC_SERVER_URL
              }/auth/social?social=${"kakao"}`}
              className="h-fit w-fit flex items-center justify-center rounded-full border border-yellow-200 "
            >
              <I.Kakao />
            </Link>
            <Link
              href={`${
                process.env.NEXT_PUBLIC_SERVER_URL
              }/auth/social?social=${"google"}`}
              className="h-fit w-fit flex items-center justify-center rounded-full border border-gray-200 "
            >
              <I.Google />
            </Link>
            <Link
              href={`${
                process.env.NEXT_PUBLIC_SERVER_URL
              }/auth/social?social=${"naver"}`}
              className="h-fit w-fit flex items-center justify-center rounded-full border border-green-500 "
            >
              <I.Naver />
            </Link>
          </div>
        </section>
      </section>
    </div>
  );
}
