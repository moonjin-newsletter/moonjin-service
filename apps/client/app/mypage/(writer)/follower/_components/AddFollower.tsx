"use client";

import { useOverlay } from "@toss/use-overlay";
import { IoCloseOutline } from "react-icons/io5";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import csr from "@lib/fetcher/csr";
import { useRouter } from "next/navigation";
import { AddExternalSubscriberResultDto } from "@moonjin/api-types";

export default function AddFollower() {
  const overlay = useOverlay();

  function AddUser() {
    overlay.open(({ isOpen }) => {
      return (
        <div
          onClick={(e) => {
            overlay.exit();
          }}
          className="fixed  top-0 flex items-center justify-center z-50 w-screen h-screen bg-black/40"
        >
          <AddFollowerOverlay overlay={overlay} />
        </div>
      );
    });
  }

  return (
    <button
      onClick={AddUser}
      className="py-2 text-sm px-2.5 bg-primary text-white rounded"
    >
      추가하기
    </button>
  );
}

function AddFollowerOverlay({ overlay }: any) {
  const router = useRouter();
  const [addUser, setAddUser] = useState("");
  const { register, handleSubmit, setValue, watch } = useForm<any>({
    defaultValues: {
      addList: [],
    },
  });

  const addedList: string[] = watch("addList");

  console.log(addedList);

  function submitFollower() {
    csr
      .post("subscribe/subscriber/external/list ", {
        json: { followerEmail: addedList },
      })
      .then(async (res) => {
        const result: { data: AddExternalSubscriberResultDto } =
          await res.json();

        if (result.data.fail.length > 0) {
          result.data.fail.map((email: string, index: number) =>
            toast.error(`${email} 추가실패`),
          );
        }
        overlay.exit();
        router.refresh();
      })
      .catch((err) => {});
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-[500px] relative overflow-hidden h-[480px]  bg-white flex flex-col "
    >
      <form
        onSubmit={handleSubmit(submitFollower)}
        className="flex h-full  flex-col w-full"
      >
        <section className="flex h-full overflow-y-auto  flex-col w-full  px-7 py-6">
          <div className="flex w-full  justify-center items-center">
            <span className="ml-auto text-lg font-semibold">구독자 추가</span>
            <div
              onClick={(e) => {
                overlay.exit();
              }}
              className="ml-auto"
            >
              <IoCloseOutline className="text-xl" />
            </div>
          </div>
          <div className="mt-8 w-full ">
            <div className="gap-x-2.5 flex w-full items-center py-3 pr-4 pl-6 rounded-full bg-grayscale-100">
              <input
                type="email"
                placeholder="추가할 이메일을 작성해주세요"
                required={true}
                onChange={(e) => setAddUser(e.target.value)}
                className="w-full placeholder:text-grayscale-500 ring-0 h-6 p-0 active:outline-none focus:ring-0 border-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => {
                  if (CheckEamil(addUser)) {
                    setValue("addList", [...addedList, addUser]);
                  } else {
                    toast.error("올바른 이메일 형식이 아닙니다");
                  }
                }}
                className="min-w-8 size-8 rounded-full bg-grayscale-600 text-lg text-white"
              >
                +
              </button>
            </div>
          </div>
          <div className="text-sm text-grayscale-400 mt-2 px-4">
            * 사용자 추가 이메일은 외부 이메일로 추가됩니다
          </div>
          {addedList.length > 0 && (
            <div className="w-full flex flex-col mt-6">
              {addedList.map((user, index) => (
                <div
                  key={index}
                  className="flex w-full justify-between items-center border-b py-4 border-grayscale-100"
                >
                  <span className="font-medium">{user}</span>
                  <button
                    onClick={() => {
                      setValue(
                        "addList",
                        addedList.filter((value, id) => id !== index),
                      );
                    }}
                    className="min-w-7 size-7 rounded-full bg-grayscale-200 flex items-center justify-center text-lg "
                  >
                    <IoCloseOutline className="text-xl text-grayscale-700" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
        <button
          type="submit"
          className="absolute bottom-0  w-full py-5 text-white bg-grayscale-600 text-lg font-medium text-center"
        >
          확인
        </button>
      </form>
    </div>
  );
}

function CheckEamil(email: string) {
  var reg_email =
    /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
  if (!reg_email.test(email)) {
    return false;
  } else {
    return true;
  }
}
