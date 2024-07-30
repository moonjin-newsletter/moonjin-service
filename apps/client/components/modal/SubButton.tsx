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

    return error.code === ErrorCodeEnum.SUBSCRIBER_NOT_FOUND
      ? csr
          .post(`subscribe/writer/${writerInfo.writerInfo.userId}`)
          .then(() => {
            toast.success("구독 완료");
            return mutate();
          })
          .catch((error) => {})
      : overlay.open(({ isOpen, unmount }) => {
          return (
            <SubModal.PreLoginSubModal
              unmount={unmount}
              writerInfo={writerInfo}
            />
          );
        });
  }

  function onClickUnSub() {
    csr
      .delete(`subscribe/writer/${moonjinId}`)
      .then(() => {
        toast.success("구독 취소");
        return mutate();
      })
      .catch((error) => {});
  }

  if (subInfo?.data?.createdAt)
    return <button onClick={onClickUnSub}>{unSubChildren}</button>;

  return <button onClick={onClickSub}>{subChildren}</button>;
}
