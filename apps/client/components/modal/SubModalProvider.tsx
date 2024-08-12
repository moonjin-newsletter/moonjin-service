"use client";

import { ReactElement } from "react";
import { WriterPublicCardDto } from "@moonjin/api-types";
import { overlay } from "overlay-kit";
import * as SubModal from "@components/modal/SubModal";
import csr from "@lib/fetcher/csr";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { isNotNil } from "@toss/utils";

export default function SubModalProvider({
  subInfo,
  writerInfo,
  subChildren,
  unSubChildren,
}: {
  subInfo: any;
  writerInfo: WriterPublicCardDto;
  subChildren: ReactElement;
  unSubChildren: ReactElement;
}) {
  const router = useRouter();

  function onClickSub() {
    if (!isNotNil(subInfo)) {
      csr
        .post(`subscribe/writer/${writerInfo.writerInfo.moonjinId}`)
        .then(() => {
          toast.success("구독 완료");
          return router.refresh();
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
      return <SubModal.CancelModal unmount={unmount} writerInfo={writerInfo} />;
    });
  }

  // if (isLoading) return <AiOutlineLoading3Quarters />;

  if (subInfo?.data?.createdAt)
    return <button onClick={onClickCancelSub}>{unSubChildren}</button>;

  return <button onClick={onClickSub}>{subChildren}</button>;
}
