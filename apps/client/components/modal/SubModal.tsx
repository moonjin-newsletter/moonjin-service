"use client";

import Image from "next/image";
import {
  ErrorCodeEnum,
  SubscribingStatusResponseDto,
  WriterPublicCardDto,
} from "@moonjin/api-types";
import { useForm } from "react-hook-form";
import * as Tb from "react-icons/tb";
import csr from "@lib/fetcher/csr";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getDateDistance } from "@toss/date";
import WebShareButton from "@components/share/WebShareButton";

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
      .post(`writer/${writerInfo.writerInfo.moonjinId}/subscribe/external`, {
        json: {
          subscriberName: data.subscriberName,
          subscriberEmail: data.subscriberEmail,
        },
      })
      .then(() => {
        toast.success("구독 완료");
        unmount();
      })
      .catch((error) => {
        console.log(error);
        if (error.code === ErrorCodeEnum.EMAIL_ALREADY_EXIST) {
          return toast.error("이미 존재하는 메일입니다");
        }

        return toast.error("잠시 후에 시도해주세요");
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
        className="animate-fade h-fit min-w-[480px] w-[480px] overflow-y-auto py-8 px-10 rounded-lg bg-white flex flex-col items-center"
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
            {...register("subscriberName", {
              required: "구독자 이름을 입력해주세요",
            })}
            placeholder={"이름을 입력해주세요(24자 이내)"}
            maxLength={24}
            type="text"
            className="w-full mt-1 px-3 py-2 border-none  rounded placeholder:text-sm bg-grayscale-100 focus:ring-0  outline-none"
          />
          {errors.subscriberName?.message && (
            <div className="flex mt-1 items-center  text-rose-500 gap-x-1">
              <Tb.TbAlertCircle />
              <span className="text-xs text-rose-500 ">{`${errors.subscriberName?.message}`}</span>
            </div>
          )}
          <label htmlFor="email" className="font-semibold text-[13px] mt-4">
            <span className="text-primary ">*</span> 구독자 이메일
          </label>
          <input
            {...register("subscriberEmail", {
              required: "구독자 이메일을 입력해주세요",
            })}
            placeholder={"이메일을 입력해주세요"}
            maxLength={24}
            type="subscriberEmail"
            className="w-full mt-1 px-3 py-2 border-none rounded placeholder:text-sm bg-grayscale-100 focus:ring-0  outline-none"
          />
          {errors.subscriberEmail?.message && (
            <div className="flex mt-1 items-center  text-rose-500 gap-x-1">
              <Tb.TbAlertCircle />
              <span className="text-xs text-rose-500 ">{`${errors.subscriberEmail?.message}`}</span>
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
  subInfo,
}: ModalType & {
  writerInfo: WriterPublicCardDto;
  subInfo: SubscribingStatusResponseDto;
  unmount: () => void;
}) {
  const router = useRouter();

  function onCancel() {
    csr
      .delete(`subscribe/writer/${writerInfo.writerInfo.userId}`)
      .then(() => {
        toast.success("구독 취소 완료");
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
        className=" h-fit animate-fade min-w-[420px] w-[420px] overflow-y-auto py-8 px-10 rounded-lg bg-white flex-col flex items-center"
      >
        <span className="text-lg font-bold">구독을 취소하시겠습니까?</span>
        <section className="flex flex-col items-center mt-4 gap-y-2">
          <span>
            {writerInfo.user.nickname}작가님의 글을{" "}
            <strong className="text-primary text-sm">
              {getDateDistance(new Date(subInfo.createdAt), new Date()).days}일
            </strong>
            동안 읽으셨어요!
          </span>
          <span className="text-sm text-grayscale-400">
            작가의 뉴스레터를 더이상 받아보실 수 없고,
            <br />
            새로운 글의 알림도 받아보실 수 없습니다.
          </span>
        </section>
        <div className="w-full mt-6 flex flex-col gap-y-2">
          <button
            onClick={unmount}
            type="button"
            className="py-3 text-sm font-medium  bg-grayscale-600 text-white rounded-lg w-full"
          >
            계속 구독하기
          </button>
          <button
            onClick={onCancel}
            type="button"
            className="py-3 text-sm font-medium border border-primary text-primary  rounded-lg w-full"
          >
            구독 취소
          </button>
        </div>
      </section>
    </div>
  );
}

export function SuccessModal({
  unmount,
  writerInfo,
}: ModalType & { writerInfo: WriterPublicCardDto }) {
  return (
    <div
      onClick={(e) => {
        unmount();
      }}
      className="fixed  top-0 flex items-center justify-center z-50 w-screen h-screen bg-black/40"
    >
      <section
        onClick={(e) => e.stopPropagation()}
        className="animate-fade h-fit min-w-[420px] w-[420px] overflow-y-auto py-8 px-10 rounded-lg bg-white flex-col flex items-center"
      >
        <Image
          src={writerInfo.user.image}
          alt={"작가 프로필 이미지"}
          width={60}
          height={60}
          className="rounded-lg"
        />
        <span className="text-[13px] mt-1 font-semibold text-primary">
          {writerInfo.writerInfo.moonjinId}@moonjin.site
        </span>
        <span className="text-lg font-bold mt-4">구독이 완료되었습니다</span>
        <section className="flex flex-col items-center mt-4 gap-y-2">
          <span className="text-sm text-grayscale-400">
            좋아하는 작가님의 뉴스레터를 주위에 알려보세요
          </span>
        </section>
        <div className="w-full mt-6 flex flex-col gap-y-2">
          <WebShareButton
            title={writerInfo.user.nickname + "작가님의 뉴스레터"}
            subtitle={"뉴스레터 공유하기"}
            url={null}
          >
            <button
              onClick={unmount}
              type="button"
              className="py-3 text-sm font-medium  bg-grayscale-600 text-white rounded-lg w-full"
            >
              공유하기
            </button>
          </WebShareButton>
          <button
            onClick={unmount}
            type="button"
            className="py-1 text-sm  underline text-grayscale-500   "
          >
            나중에하기
          </button>
        </div>
      </section>
    </div>
  );
}
