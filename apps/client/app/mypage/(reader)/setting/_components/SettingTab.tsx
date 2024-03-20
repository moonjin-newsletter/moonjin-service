"use client";
import { Tab } from "@headlessui/react";
import { Fragment, useEffect } from "react";

import { useForm } from "react-hook-form";
import useSWR from "swr";
import type { ResponseForm } from "@moonjin/api-types";
import csr from "../../../../../lib/fetcher/csr";

export default function SettingTab() {
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
          <ProfileLayout />
        </Tab.Panel>
        <Tab.Panel>
          <PasswordLayout />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}

function PasswordLayout() {
  const { data: userInfo, isLoading } = useSWR<ResponseForm<any>>("user");
  const {
    setValue,
    formState: { errors, isValid },
    handleSubmit,
    register,
  } = useForm();

  function onClickSubmit(value: any) {
    console.log(value, 1);
    csr.post("auth/password", { body: value });
  }

  useEffect(() => {
    setValue("email", userInfo?.data?.user?.email);
  }, [isLoading]);

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
          {...register("email")}
          // placeholder={userInfo?.data?.user?.email}
          defaultValue={userInfo?.data?.user?.email}
          className="w-full mt-2 h-10 bg-grayscale-100 outline-0 border-0 rounded px-2 focus:ring-0 placeholder:text-sm placeholder:text-grayscale-400"
        />
        <label className="mt-4" htmlFor="nickname">
          새로운 비밀번호
        </label>
        <input
          {...register("password")}
          type="password"
          className="w-full mt-2 h-10 bg-grayscale-100 outline-0 border-0 rounded px-2 focus:ring-0 placeholder:text-sm placeholder:text-grayscale-400"
        />
        <button
          type="submit"
          className="w-full h-12 bg-primary text-white rounded mt-4"
        >
          비밀번호 변경
        </button>
      </form>
    </section>
  );
}

function ProfileLayout() {
  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
  } = useForm();

  function onClickSubmit() {
    return;
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
          placeholder="황재하"
          className="w-full mt-2 h-10 bg-grayscale-100 outline-0 border-0 rounded px-2 focus:ring-0 placeholder:text-sm placeholder:text-grayscale-400"
        />
      </form>
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
    </section>
  );
}
