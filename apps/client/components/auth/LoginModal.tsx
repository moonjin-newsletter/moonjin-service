"use client";

import { useForm } from "react-hook-form";

export default function LoginModal({ setIsActive }: { setIsActive: any }) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function onClickLogin(data: any) {
    console.log(data);
  }

  return (
    <div
      onClick={(e) => {
        setIsActive(false);
      }}
      className="fixed top-0 bottom-0 w-full h-full flex items-center justify-center bg-black/30"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className=" flex flex-col items-center pb-16  rounded-lg w-full max-w-[600px] h-full max-h-[480px] bg-white py-10 px-20"
      >
        <div className="flex w-full justify-end">
          <button onClick={() => setIsActive(false)} className="">
            x
          </button>
        </div>
        <h1 className="text-2xl font-bold">로그인</h1>
        <hr className="mt-3 w-full text-gray-700" />
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
            className="w-full h-10 rounded-2xl bg-[#7b0000] text-white"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
