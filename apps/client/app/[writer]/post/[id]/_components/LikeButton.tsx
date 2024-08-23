"use client";

import { LogoSymbolGray } from "@components/icons";
import useSWR from "swr";
import { NewsletterLikeResponseDto, ResponseForm } from "@moonjin/api-types";
import csr from "@lib/fetcher/csr";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type LikeButtonProps = {
  nId: number;
};

export default function LikeButton({ nId }: LikeButtonProps) {
  const router = useRouter();
  const { data: likeInfo, mutate } = useSWR<
    ResponseForm<NewsletterLikeResponseDto>
  >(`newsletter/${nId}/like`);

  function onClickLike() {
    if (!likeInfo?.data?.like) {
      csr
        .post(`newsletter/${nId}/like`)
        .then(() => {
          mutate();
          toast.success("올려두기 완료");
        })
        .catch((err) => {
          console.log(err);
          if (err.httpStatus === 401) {
            toast.error("로그인이 필요합니다.");
          }
        });

      return router.refresh();
    } else {
      csr.delete(`newsletter/${nId}/like`).then(() => {
        mutate();
        toast.error("올려두기 취소");
      });

      return router.refresh();
    }
  }

  return (
    <button
      onClick={onClickLike}
      className={`${
        likeInfo?.data?.like
          ? " text-primary border-primary"
          : "text-grayscale-500 border-grayscale-300"
      } text-sm border rounded-full py-1.5 px-4 flex items-center gap-x-2 text-grayscale-500 border-grayscale-300`}
    >
      <LogoSymbolGray width="20" height="20" viewBox="0 0 24 24" /> 올려두기
    </button>
  );
}
