"use client";

import Link from "next/link";
import { BiPencil, BiTrash } from "react-icons/bi";
import useSWR from "swr";
import type { ResponseForm, UserOrWriterDto } from "@moonjin/api-types";
import csr from "@lib/fetcher/csr";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type PropsType = {
  moonjinId: string;
  nId: number;
};

export default function UpdateSection({ moonjinId, nId }: PropsType) {
  const router = useRouter();
  const { data: userInfo } = useSWR<ResponseForm<UserOrWriterDto>>("user");

  function onClickDelete() {
    if (confirm("정말 삭제하시겠습니까?")) {
      csr
        .delete(`newsletter/${nId}`)
        .then(() => {
          router.push(`/@${moonjinId}`);
        })
        .catch(() => {
          toast.error("삭제 실패");
        });
    }
  }

  return (
    <>
      {moonjinId === userInfo?.data?.writerInfo?.moonjinId && (
        <div className="flex items-center gap-x-4">
          <Link
            href={`/write/${nId}/update`}
            className="flex items-center gap-x-0.5 text-[#999999] text-sm underline"
          >
            <BiPencil className="text-[17px] text-grayscale-400" />
            <span>수정</span>
          </Link>
          <button
            onClick={onClickDelete}
            className="flex items-center gap-x-0.5 text-[#999999] text-sm underline"
          >
            <BiTrash />
            <span>삭제</span>
          </button>
        </div>
      )}
    </>
  );
}
