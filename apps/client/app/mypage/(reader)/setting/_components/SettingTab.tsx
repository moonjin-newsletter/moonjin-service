"use client";
import { Tab } from "@headlessui/react";
import { Fragment, useEffect } from "react";

import { useForm } from "react-hook-form";
import useSWR from "swr";
import { ErrorCodeEnum, ResponseForm } from "@moonjin/api-types";
import csr from "../../../../../lib/fetcher/csr";
import toast from "react-hot-toast";

export default function SettingTab() {
  const { data: userInfo } = useSWR<ResponseForm<any>>("user");
  const { data: userSocial } =
    useSWR<ResponseForm<{ social: string }>>("user/oauth");

  return (
    <Tab.Group>
      <Tab.List className="w-full flex gap-x-4">
        {["프로필 설정", "비밀번호 변경"].map((category, index) => (
          <Tab key={index} as={Fragment}>
            {({ selected }) => (
              /* Use the `selected` state to conditionally style the selected tab. */
              <button
                className={`${
                  selected ? "border-b-2 font-semibold" : null
                } border-primary py-1 outline-none`}
              >
                {category}
              </button>
            )}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="w-full mt-4">
        <Tab.Panel>
          <ProfileLayout userInfo={userInfo} />
        </Tab.Panel>
        <Tab.Panel>
          <PasswordLayout userInfo={userInfo} userSocial={userSocial} />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}

function PasswordLayout({
  userInfo,
  userSocial,
}: {
  userInfo?: any;
  userSocial: any;
}) {
  const {
    setValue,
    formState: { errors, isValid },
    handleSubmit,
    register,
  } = useForm();

  function onClickSubmit(value: any) {
    csr
      .patch("user/password", { json: value })
      .then((res) => toast.success("이메일을 발송했습니다"))
      .catch((err) => toast.error("비밀번호 변경에 실패했습니다"));
  }

  useEffect(() => {
    setValue("email", userInfo?.data?.user?.email);
  }, []);

  return (
    <section className="flex flex-col w-full">
      <form
        onSubmit={handleSubmit(onClickSubmit)}
        className="w-full flex flex-col"
      >
        <label className="mt-4" htmlFor="nickname">
          이메일
        </label>
        <input
          type="email"
          disabled={true}
          {...register("email")}
          // placeholder={userInfo?.data?.user?.email}
          defaultValue={userInfo?.data?.user?.email}
          className="w-full mt-2 h-10 bg-grayscale-100 outline-0 border-0 rounded px-2 focus:ring-0 placeholder:text-sm placeholder:text-grayscale-400"
        />
        {userSocial?.data?.social !== "moonjin" ? (
          <div className="w-full mt-4 flex items-center justify-center py-6 bg-grayscale-200 rounded-lg font-medium">
            소셜로그인 유저입니다
          </div>
        ) : (
          <>
            <label className="mt-4" htmlFor="newPassword">
              새로운 비밀번호
            </label>
            <input
              {...register("newPassword")}
              type="password"
              className="w-full mt-2 h-10 bg-grayscale-100 outline-0 border-0 rounded px-2 focus:ring-0 placeholder:text-sm placeholder:text-grayscale-400"
            />
            <button
              type="submit"
              className="w-full h-12 bg-primary text-white rounded mt-4"
            >
              비밀번호 변경
            </button>
          </>
        )}
      </form>
    </section>
  );
}

function ProfileLayout({ userInfo }: { userInfo?: any }) {
  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
  } = useForm();

  function onClickSubmit(value: any) {
    csr
      .patch("user/profile", { json: value })
      .then((res) => toast.success("프로필이 변경됐습니다"))
      .catch((err) => {
        if (err.code === ErrorCodeEnum.NICKNAME_ALREADY_EXIST)
          toast.error("이미 존재하는 이메일입니다");
        else toast.error("닉네임 변경에 실패하였습니다");
      });
  }

  return (
    <section className="flex flex-col w-full">
      <form
        onSubmit={handleSubmit(onClickSubmit)}
        className="w-full flex flex-col"
      >
        <label className="mt-4" htmlFor="nickname">
          프로필명
        </label>
        <input
          {...register("nickname")}
          placeholder={userInfo?.data?.user?.nickname}
          className="w-full mt-2 h-10 bg-grayscale-100 outline-0 border-0 rounded px-2 focus:ring-0 placeholder:text-sm placeholder:text-grayscale-400"
        />
        <a
          href="mailto:moonjin6239@gmail.com"
          className="text-rose-500 underline mt-8"
        >
          계정 탈퇴하기
        </a>
        <button
          disabled={!isValid}
          type="submit"
          className="w-full h-12 bg-primary text-white rounded mt-4"
        >
          설정 완료
        </button>
      </form>
    </section>
  );
}
