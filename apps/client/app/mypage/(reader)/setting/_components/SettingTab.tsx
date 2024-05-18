"use client";
import { Tab } from "@headlessui/react";
import { Fragment, useEffect } from "react";

import { useForm } from "react-hook-form";
import useSWR from "swr";
import {
  ErrorCodeEnum,
  FileTypeEnum,
  IChangeWriterProfile,
  ResponseForm,
} from "@moonjin/api-types";
import csr from "../../../../../lib/fetcher/csr";
import toast from "react-hot-toast";
import { fileUpload } from "../../../../../lib/file/fileUpload";
import Image from "next/image";

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
          {userInfo?.data?.user?.role === 1 ? (
            <WriterProfileLayout userInfo={userInfo} />
          ) : (
            <ProfileLayout userInfo={userInfo} />
          )}
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
  console.log(userInfo);
  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      nickname: userInfo?.data?.user?.nickname,
    },
  });

  function onClickSubmit(value: any) {
    csr
      .patch("user/profile", { json: value })
      .then((res) => {
        toast.success("프로필이 변경됐습니다");
        window.location.reload();
      })
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
          placeholder="변경할 프로필명을 입력해주세요"
          className="w-full mt-2 h-10 bg-grayscale-100 outline-0 border-0 rounded px-2 focus:ring-0 placeholder:text-sm placeholder:text-grayscale-400"
        />

        <button
          disabled={!isValid}
          type="submit"
          className="w-full h-12 bg-primary text-white rounded mt-8"
        >
          설정 완료
        </button>
      </form>
    </section>
  );
}

function WriterProfileLayout({ userInfo }: { userInfo?: any }) {
  console.log(userInfo);
  const {
    formState: { errors, isValid },
    handleSubmit,
    register,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      nickname: userInfo?.data?.user?.nickname,
      moonjinId: userInfo?.data?.writerInfo?.moonjinId,
      description: userInfo?.data?.writerInfo?.description,
      image: userInfo?.data?.user?.image,
    },
  });
  const userData = watch();

  function onClickSubmit(value: IChangeWriterProfile) {
    csr
      .patch("user/writer/profile", { json: value })
      .then((res) => {
        toast.success("프로필이 변경됐습니다");
        window.location.reload();
      })
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
        <label className="mt-2 text-sm font-medium" htmlFor="nickname">
          문진 아이디
        </label>
        <input
          {...register("moonjinId")}
          placeholder="변경을 원하시는 아이디를 입력해주세요"
          className="w-full mt-2 h-10 bg-grayscale-100 outline-0 border-0 rounded px-2 focus:ring-0 placeholder:text-sm placeholder:text-grayscale-400"
        />
        <div className="flex flex-col mt-2 gap-y-1.5">
          <span className="text-sm text-grayscale-500">
            문진 이메일 :{" "}
            {userData?.moonjinId
              ? userData?.moonjinId
              : userInfo?.data?.writerInfo?.moonjinId}
            @moonjin.site
          </span>
          <span className="text-sm text-grayscale-500">
            작가 URL : https://moonjin.site/@
            {userData?.moonjinId
              ? userData?.moonjinId
              : userInfo?.data?.writerInfo?.moonjinId}
          </span>
        </div>

        <label className="mt-8 text-sm font-medium" htmlFor="nickname">
          프로필명
        </label>
        <input
          {...register("nickname")}
          placeholder="변경을 원하시는 프로필 이름을 입력해주세요"
          className="w-full mt-2 h-10 bg-grayscale-100 outline-0 border-0 rounded px-2 focus:ring-0 placeholder:text-sm placeholder:text-grayscale-400"
        />

        <label className="mt-8 text-sm font-medium" htmlFor="nickname">
          자기 소개
        </label>
        <input
          {...register("description", { maxLength: 120 })}
          placeholder="변경을 원하시는 한 줄 소개를 입력해주세요 (최대 120자)"
          maxLength={120}
          className="w-full mt-2 h-10 bg-grayscale-100 outline-0 border-0 rounded px-2 focus:ring-0 placeholder:text-sm placeholder:text-grayscale-400"
        />

        <span className="mt-8 text-sm font-medium">프로필 이미지</span>
        <label className="mt-2 w-fit cursor-pointer">
          {userData?.image ? (
            <Image
              width={140}
              height={140}
              src={userData.image}
              alt="유저 프로필 이미지"
              className="object-cover rounded border"
            />
          ) : (
            <div className="w-[140px] h-[140px] rounded bg-grayscale-100" />
          )}
          <div className="py-2 w-full bg-grayscale-500 text-white rounded mt-2 flex items-center justify-center text-sm">
            변경하기
          </div>
          <input
            onChange={async (e) => {
              if (e?.target?.files) {
                try {
                  const fileUrl = await fileUpload(
                    e.target.files[0],
                    FileTypeEnum.COVER_IMAGE,
                  );
                  setValue("image", fileUrl?.file);
                } catch (e) {
                  toast.error("이미지 업로드 실패");
                }
              }
            }}
            multiple={false}
            type="file"
            accept="image/*"
            className="hidden"
          />
        </label>

        <button
          disabled={!isValid}
          type="submit"
          className="w-full h-12 bg-primary text-white rounded mt-8"
        >
          설정 완료
        </button>
      </form>
    </section>
  );
}
