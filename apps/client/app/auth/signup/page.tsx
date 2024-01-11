"use client";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useEffect } from "react";
import csr from "../../../lib/fetcher/csr";

export default function Page() {
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
    if (data.password !== data.passwordCheck)
      return toast.error("비밀번호를 확인해주세요");
    delete data["passwordCheck"];
    const auth = {
      ...data,
      role: parseInt(data.role),
    };

    await csr
      .post("user", { json: auth })
      .then((res) => {
        toast.success("메일을 확인해주세요!");
      })
      .catch((err) => alert("회원가입 실패"));
  }

  useEffect(() => {
    resetField("moonjinEmail");
  }, [role]);

  return (
    <div className="w-full h-full  flex flex-col items-center ">
      <section className="w-full max-w-[1024px]  flex flex-col items-center">
        <div className=" my-20 flex w-full py-8 px-20 rounded-xl border border-gray-200 max-w-[600px] gap-y-3 flex-col items-center">
          <h1 className="text-2xl font-bold ">회원가입</h1>
          <hr className=" w-full py-0 mt-4 text-gray-700" />
          <form
            onSubmit={handleSubmit(onClickSignup)}
            className="w-full h-fit flex flex-col items-start gap-y-3"
          >
            <div className="w-full flex mt-4 flex-col  ">
              <span>회원구분</span>
              <div className="flex mt-2 w-full items-center gap-x-3">
                <div className="flex items-center gap-x-2">
                  <input
                    {...register("role", { required: "이메일을 입력해주세요" })}
                    id="0"
                    type="radio"
                    name="role"
                    defaultChecked={true}
                    value={0}
                    className="w-4 h-4 text-[#7b0000]  border-4 border-gray-400 focus:ring-[#7b0000] dark:focus:ring-[#7b0000] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="0">독자 회원</label>
                </div>
                <div className="flex items-center gap-x-2">
                  <input
                    {...register("role", { required: "이메일을 입력해주세요" })}
                    id="1"
                    type="radio"
                    name="role"
                    value={1}
                    className="w-4 h-4 text-[#7b0000]  border-4 border-gray-400 focus:ring-[#7b0000] dark:focus:ring-[#7b0000] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="1">작가 회원</label>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full">
              <label htmlFor="nickname">닉네임</label>
              <input
                type="text"
                id="nickname"
                placeholder="닉네임"
                className="mt-2 w-full h-10 border rounded-lg px-2 placeholder:text-sm"
                {...register("nickname", { required: "닉네임을 입력해주세요" })}
              />
              {errors.nickname?.message && (
                <span className="text-xs text-rose-500 ">{`${errors.nickname?.message}`}</span>
              )}
              <label className="mt-4" htmlFor="email">
                이메일
              </label>
              <input
                id="email"
                type="email"
                placeholder="이메일"
                className="mt-2 w-full h-10 border rounded-lg px-2 placeholder:text-sm"
                {...register("email", { required: "이메일을 입력해주세요" })}
              />
              {errors.email?.message && (
                <span className="text-xs text-rose-500 ">{`${errors.email?.message}`}</span>
              )}
              <label className="mt-4" htmlFor="password">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                placeholder="비밀번호"
                className="mt-2 w-full h-10 border rounded-lg px-2 placeholder:text-sm"
                {...register("password", {
                  required: "비밀번호를 입력해주세요",
                })}
              />
              {errors.password?.message && (
                <span className="text-xs text-rose-500 ">{`${errors.password?.message}`}</span>
              )}
              <label className="mt-4" htmlFor="passwordCheck">
                비밀번호 확인
              </label>
              <input
                id="passwordCheck"
                type="password"
                placeholder="비밀번호 확인"
                className="mt-2 w-full h-10 border rounded-lg px-2 placeholder:text-sm"
                {...register("passwordCheck", {
                  required: "비밀번호를 확인해주세요",
                })}
              />
              {errors.passwordCheck?.message && (
                <span className="text-xs text-rose-500 ">{`${errors.passwordCheck?.message}`}</span>
              )}
              {role === "1" ? (
                <div className="w-full mt-4">
                  <label htmlFor="moonjinEmail">문진 이메일</label>
                  <div className="mt-2 flex items-center text-gray-800">
                    <input
                      id="moonjinEmail"
                      type="text"
                      placeholder="문진 이메일 아이디"
                      className=" w-1/3 h-10 border rounded-lg px-2 placeholder:text-sm"
                      {...register("moonjinEmail", {
                        required: "레터를 발송할 이메일을 입력해주세요",
                      })}
                    />
                    @ moonjin.site
                  </div>
                  {errors.moonjinEmail?.message && (
                    <span className="text-xs text-rose-500 ">{`${errors.moonjinEmail?.message}`}</span>
                  )}
                </div>
              ) : null}
            </div>
            <button
              disabled={!isValid}
              type="submit"
              className="mt-2 disabled:bg-gray-600 w-full h-10 rounded-2xl bg-[#7b0000] text-white"
            >
              회원가입
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
