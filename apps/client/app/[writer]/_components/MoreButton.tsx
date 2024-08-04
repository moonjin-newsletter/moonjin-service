"use client";

import { overlay } from "overlay-kit";
import WriterInfoModal from "./WriterInfoModal";
import { More } from "@components/icons";
import type { WriterPublicCardDto } from "@moonjin/api-types";

export default function MoreButton({
  writerInfo,
}: {
  writerInfo: WriterPublicCardDto;
}) {
  return (
    <button
      onClick={() => {
        overlay.open(({ isOpen, unmount }) => {
          return <WriterInfoModal unmount={unmount} writerInfo={writerInfo} />;
        });
      }}
    >
      <More />
    </button>
  );
}
