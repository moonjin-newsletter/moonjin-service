"use client";

import { ReactElement } from "react";
import useSWR from "swr";
import {
  ErrorCodeEnum,
  ResponseForm,
  SubscribeInfoDto,
  WriterPublicCardDto,
} from "@moonjin/api-types";
import { overlay } from "overlay-kit";
import * as SubModal from "@components/modal/SubModal";
import csr from "@lib/fetcher/csr";
import toast from "react-hot-toast";

export default function SubButton({
  moonjinId,
  writerInfo,
  subChildren,
  unSubChildren,
}: {
  moonjinId: string;
  writerInfo: WriterPublicCardDto;
  subChildren: ReactElement;
  unSubChildren: ReactElement;
}) {
  const {
    data: subInfo,
    error,
    isLoading,
    mutate,
  } = useSWR<ResponseForm<SubscribeInfoDto>>(
    `subscribe/writer/${moonjinId}/info`,
    {
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        if (retryCount > 1) return;
      },
    },
  );

  function onClickSub() {
    if (error.code === ErrorCodeEnum.SUBSCRIBE_MYSELF_ERROR) {
      toast.error("자신은 구독할 수 없습니다.");
    } else if (error.code === ErrorCodeEnum.SUBSCRIBER_NOT_FOUND) {
      csr
        .post(`subscribe/writer/${writerInfo.writerInfo.moonjinId}`)
        .then(() => {
          toast.success("구독 완료");
          return mutate();
        })
        .catch((error) => {});
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
          mutate={mutate}
        />
      );
    });
  }

  // if (isLoading) return <AiOutlineLoading3Quarters />;

  if (subInfo?.data?.createdAt)
    return <button onClick={onClickCancelSub}>{unSubChildren}</button>;

  return <button onClick={onClickSub}>{subChildren}</button>;
}
