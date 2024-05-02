"use client";
import { LogoIcon, LogoIconGray } from "../../../../../components/icons";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import * as I from "components/icons";
import csr from "../../../../../lib/fetcher/csr";

export default function MailSendingSection({ letterId }: { letterId: number }) {
  const [testAddUser, setTestAddUser] = useState<any[]>([]);
  const { handleSubmit, setValue, watch, register } = useForm({
    defaultValues: {
      testUser: null,
      deployUser: null,
    },
  });
  const testUser = watch("testUser");

  function AddTestUser() {
    if (testAddUser.length > 4) toast.error("최대인원을 초과했습니다");
    else {
      setTestAddUser((prev) => [...prev, testUser]);
      return setValue("testUser", null);
    }
  }

  async function sendTestLetter() {
    if (testAddUser.length > 0) {
      await csr
        .post(`post/${letterId}/newsletter/test`, {
          json: { receiverEmails: testAddUser },
        })
        .then((res) => toast.success("메일함을 확인하세요"))
        .catch((err) => toast.error("메일 전송오류"));
    } else {
      return toast.error("수신인을 추가해주세요");
    }
  }

  return (
    <section className="w-full flex flex-col">
      <div className="flex items-center gap-x-3 text-grayscale-700 text-xl font-semibold">
        <LogoIconGray />
        테스트 뉴스레터 발송하기
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-x-6 mt-8">
          <span className="text-lg font-medium text-grayscale-700">
            받을 사람
          </span>
          <span className="text-sm text-grayscale-500">
            최대 추가 인원: 5명
          </span>
        </div>
        <div className="w-full mt-2 flex gap-x-2.5 items-center h-12">
          <input
            {...register("testUser")}
            type="email"
            placeholder="뉴스레터 수신자의 이름을 입력해주세요"
            className="ring-0 w-full  outline-none focus:border-slate-400 focus:ring-0 h-full bg-grayscale-100 border border-grayscale-300 placeholder:text-grayscale-500 rounded"
          />
          <button
            onClick={AddTestUser}
            className="h-full text-sm rounded whitespace-nowrap text-white bg-grayscale-700/90 px-4"
          >
            추가
          </button>
        </div>
        <div className="flex mt-4 gap-x-2.5 gap-y-1.5 flex-wrap">
          {testAddUser.map((name, index) => (
            <div
              key={index}
              className="px-4 flex items-center gap-x-1 py-2 border border-slate-800 text-slate-800 rounded-full"
            >
              {name}
              <button
                onClick={() => {
                  setTestAddUser(
                    testAddUser.filter((value, id) => id !== index),
                  );
                }}
              >
                <IoClose className="text-lg" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex py-20 items-end gap-x-2.5">
          <hr className=" border-grayscale-200 w-full" />
          <button
            onClick={sendTestLetter}
            className="bg-grayscale-400 flex items-center gap-x-1.5 text-sm whitespace-nowrap text-white py-2.5 px-4 rounded-lg"
          >
            <I.SendOutline /> 테스트 뉴스레터 발송하기
          </button>
        </div>
      </div>
      <div className="flex items-center mt-16 gap-x-3 text-grayscale-700 text-xl font-semibold">
        <LogoIcon width="32" height="32" viewBox="0 0 67 67" />
        정식 뉴스레터 발송하기
      </div>
      <div className="flex flex-col mt-8">
        <h3 className="text-lg font-medium ">뉴스레터 제목</h3>
        <span className="text-sm font-medium text-grayscale-500">
          작성하신 글의 제목과 다른 뉴스레터 제목을 사용하고 싶으시면 입력해
          주세요.
        </span>
        <input
          defaultValue={"나의 뉴스레터"}
          className="ring-0 mt-2 w-full h-11 outline-none focus:border-slate-400 focus:ring-0  bg-grayscale-100 border border-grayscale-300 placeholder:text-grayscale-500 rounded"
        />
      </div>
      <div className="flex flex-col mt-8">
        <h3 className="text-lg font-medium ">받는 사람</h3>
        <div className="flex justify-between mt-4">
          <div className="flex flex-col ">
            <div className="text-grayscale-600 ">
              내 구독자 수<span className="text-grayscale-200"> | </span>
              <span className="text-grayscale-700">
                <strong className="text-primary font-medium">180</strong>명
              </span>
            </div>
            <span className="mt-1 text-sm font-medium text-grayscale-500">
              뉴스레터는 작가님의 모든 구독자에게 전송됩니다.
            </span>
          </div>
          <Link
            href="/mypage/follower"
            target="_blank"
            className="py-2.5 h-fit text-sm px-3 bg-grayscale-700/90 text-white rounded"
          >
            내 구독자 확인하기
          </Link>
        </div>
      </div>
      <div className="flex py-20 items-end gap-x-2.5">
        <hr className=" border-grayscale-200 w-full" />
        <button className="bg-primary flex items-center gap-x-1.5 text-sm whitespace-nowrap text-white py-2.5 px-4 rounded-lg">
          <I.SendFilled /> 정식 뉴스레터 발송하기
        </button>
      </div>
    </section>
  );
}
