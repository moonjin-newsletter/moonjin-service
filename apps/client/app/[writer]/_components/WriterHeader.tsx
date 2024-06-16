"use client";

import * as I from "@components/icons";
import Link from "next/link";

export default function WriterHeader() {
  return (
    <header className="w-full flex justify-center h-16">
      <section className="max-w-[1006px] w-full flex items-center">
        <Link className="flex  items-center h-full text-white" href="/">
          <I.Logo fill="#7b0000" height="29" viewBox="0 0 149 39" width="139" />
        </Link>
      </section>
    </header>
  );
}
