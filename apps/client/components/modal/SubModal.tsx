"use client";

import Image from "next/image";
import type { WriterPublicCardDto } from "@moonjin/api-types";
import { useForm } from "react-hook-form";
import * as Tb from "react-icons/tb";
import csr from "@lib/fetcher/csr";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type ModalType = {
  unmount: () => void;
};

export function PreLoginSubModal({
  writerInfo,
  unmount,
}: { writerInfo: WriterPublicCardDto } & ModalType) {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function onPreSub(data: any) {
    csr
      .post(`writer/${writerInfo.writerInfo.userId}/subscribe/external`, data)
      .then(() => {
        toast.success("구독 완료");
        unmount();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div
      onClick={(e) => {
        unmount();
      }}
      className="fixed  top-0 flex items-center justify-center z-50 w-screen h-screen bg-black/40"
    >
      <section
        onClick={(e) => e.stopPropagation()}
        className=" h-fit min-w-[480px] w-[480px] overflow-y-auto py-8 px-10 rounded-lg bg-white flex flex-col items-center"
      >
        <div className="flex flex-col items-center">
          <Image
            src={writerInfo.user.image}
            alt="유저 프로필 이미지"
            width={100}
            height={100}
            className="rounded-lg border"
          />
          <p className="text-lg font-semibold mt-2">
            {writerInfo.user.nickname}
          </p>
          <p className="text-sm font-medium text-primary mt-1">
            {writerInfo.writerInfo.moonjinId}@moonjin.site
          </p>
          <p className="text-sm text-grayscale-600 mt-6 px-12 text-center">
            {writerInfo.user.description}
          </p>
        </div>
        <form
          onSubmit={handleSubmit(onPreSub)}
          className="mt-10 w-full flex flex-col"
        >
          <label htmlFor="name" className="font-semibold text-[13px]">
            <span className="text-primary">*</span> 구독자 이름
          </label>
          <input
            {...register("name", { required: "구독자 이름을 입력해주세요" })}
            placeholder={"이름을 입력해주세요(24자 이내)"}
            maxLength={24}
            type="text"
            className="w-full mt-1 px-3 py-2 border-none  rounded placeholder:text-sm bg-grayscale-100 focus:ring-0  outline-none"
          />
          {errors.name?.message && (
            <div className="flex mt-1 items-center  text-rose-500 gap-x-1">
              <Tb.TbAlertCircle />
              <span className="text-xs text-rose-500 ">{`${errors.name?.message}`}</span>
            </div>
          )}
          <label htmlFor="email" className="font-semibold text-[13px] mt-4">
            <span className="text-primary ">*</span> 구독자 이메일
          </label>
          <input
            {...register("email", { required: "구독자 이메일을 입력해주세요" })}
            placeholder={"이메일을 입력해주세요"}
            maxLength={24}
            type="email"
            className="w-full mt-1 px-3 py-2 border-none rounded placeholder:text-sm bg-grayscale-100 focus:ring-0  outline-none"
          />
          {errors.email?.message && (
            <div className="flex mt-1 items-center  text-rose-500 gap-x-1">
              <Tb.TbAlertCircle />
              <span className="text-xs text-rose-500 ">{`${errors.email?.message}`}</span>
            </div>
          )}
          <div className="flex items-center mt-3">
            <input
              {...register("isAgree", {
                required: "개인정보 수집 및 이용에 동의해주세요",
              })}
              required={true}
              type="checkbox"
              className="w-4 h-4  rounded border border-grayscale-500 focus:ring-0  outline-none text-primary"
            />
            <label
              htmlFor="isAgree"
              className="text-sm ml-2 text-grayscale-500"
            >
              [필수] 문진 이용약관 및 개인정보처리방침에 동의합니다.
            </label>
          </div>
          {/*{errors.isAgree?.message && (*/}
          {/*  <div className="flex mt-1 items-center  text-rose-500 gap-x-1">*/}
          {/*    <Tb.TbAlertCircle />*/}
          {/*    <span className="text-xs text-rose-500 ">{`${errors.isAgree?.message}`}</span>*/}
          {/*  </div>*/}
          {/*)}*/}
          <div className="flex items-center mt-5 gap-x-2">
            <button
              onClick={unmount}
              type="button"
              className="w-1/2 py-3 text-sm font-medium  border border-grayscale-200 text-grayscale-600 rounded-lg "
            >
              취소
            </button>
            <button
              type="submit"
              className="w-1/2 py-3 text-sm font-medium text-white bg-primary rounded-lg"
            >
              구독하기
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export function LoginSubModal({ unmount }: ModalType) {
  return (
    <div
      onClick={(e) => {
        unmount();
      }}
      className="fixed  top-0 flex items-center justify-center z-50 w-screen h-screen bg-black/40"
    >
      <section
        onClick={(e) => e.stopPropagation()}
        className=" h-fit min-w-[520px] w-[540px] overflow-y-auto py-8 px-10 rounded-lg bg-white"
      ></section>
    </div>
  );
}

export function CancelModal({
  unmount,
  writerInfo,
}: ModalType & {
  writerInfo: WriterPublicCardDto;
  unmount: () => void;
}) {
  const router = useRouter();

  function onCancel() {
    csr
      .delete(`subscribe/writer/${writerInfo.writerInfo.userId}`)
      .then(() => {
        toast.success("구독 취소");
        return router.refresh();
      })
      .catch((error) => {
        toast.error("다시 시도해주세요");
      });
    unmount();
  }

  return (
    <div
      onClick={(e) => {
        unmount();
      }}
      className="fixed  top-0 flex items-center justify-center z-50 w-screen h-screen bg-black/40"
    >
      <section
        onClick={(e) => e.stopPropagation()}
        className=" h-fit min-w-[420px] w-[420px] overflow-y-auto py-8 px-10 rounded-lg bg-white flex-col flex items-center"
      >
        <span className="text-lg font-bold">구독을 취소하시겠습니까?</span>
        <div className="w-full mt-6 flex flex-col gap-y-2">
          <button
            onClick={unmount}
            type="button"
            className="py-3 text-sm font-medium  bg-grayscale-700 text-white rounded-lg w-full"
          >
            계속 구독하기
          </button>
          <button
            onClick={onCancel}
            type="button"
            className="py-3 text-sm font-medium border border-rose-600 text-rose-600  rounded-lg w-full"
          >
            구독 취소
          </button>
        </div>
      </section>
    </div>
  );
}

export function SuccessModal({ unmount }: ModalType) {
  return (
    <div
      onClick={(e) => {
        unmount();
      }}
      className="fixed  top-0 flex items-center justify-center z-50 w-screen h-screen bg-black/40"
    >
      <section
        onClick={(e) => e.stopPropagation()}
        className=" h-fit min-w-[520px] w-[540px] overflow-y-auto py-8 px-10 rounded-lg bg-white"
      ></section>
    </div>
  );
}
