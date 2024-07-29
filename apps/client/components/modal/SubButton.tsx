"use client";

import { ReactElement } from "react";

export default function SubButton({
  subChildren,
  unSubChildren,
}: {
  subChildren: ReactElement;
  unSubChildren: ReactElement;
}) {
  return (
    <div className="flex items-center justify-center">
      {1 === 1 ? subChildren : unSubChildren}
    </div>
  );
}
