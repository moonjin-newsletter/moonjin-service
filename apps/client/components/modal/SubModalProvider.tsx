"use client";

import { ReactElement } from "react";
import {
  ErrorCodeEnum,
  SubscribingResponseDto,
  SubscribingStatusResponseDto,
  WriterPublicCardDto,
} from "@moonjin/api-types";
import { overlay } from "overlay-kit";
import * as SubModal from "@components/modal/SubModal";
import csr from "@lib/fetcher/csr";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SubModalProvider({
  subInfo,
  writerInfo,
  subChildren,
  unSubChildren,
}: {
  subInfo: SubscribingResponseDto | null;
  writerInfo: WriterPublicCardDto;
  subChildren: ReactElement;
  unSubChildren: ReactElement;
}) {
  const router = useRouter();

  function onClickSub() {
    if (subInfo) {
      csr
        .post(`subscribe/writer/${writerInfo.writerInfo.userId}`)
        .then(() => {
          toast.success("구독 완료");
          return router.refresh();
        })
        .catch((error) => {
          if ((error.code = ErrorCodeEnum.SUBSCRIBE_MYSELF_ERROR)) {
            return toast.error("자신은 구독할 수 없습니다.");
          }
        });
    } else {
      return overlay.open(({ isOpen, unmount }) => {
        return (
          <SubModal.PreLoginSubModal
            unmount={unmount}
            writerInfo={writerInfo}
          />
        );
      });
    }
  }

  function onClickCancelSub() {
    return overlay.open(({ isOpen, unmount }) => {
      return (
        <SubModal.CancelModal
          unmount={unmount}
          writerInfo={writerInfo}
          subInfo={subInfo as SubscribingStatusResponseDto}
        />
      );
    });
  }

  // if (isLoading) return <AiOutlineLoading3Quarters />;

  // if (subInfo?.isSubscribing === false && subInfo?.isMe)
  //   return toast.error("자신은 구독할 수 없습니다.");

  if (subInfo?.isSubscribing)
    return <button onClick={onClickCancelSub}>{unSubChildren}</button>;

  return <button onClick={onClickSub}>{subChildren}</button>;
}
