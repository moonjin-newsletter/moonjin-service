import Link from "next/link";
import * as Io from "react-icons/io";

export default function Page() {
  return (
    <div className="overflow-hidden w-full max-w-[748px]">
      <Link
        href=""
        className="flex gap-x-1 items-center text-grayscale-700 text-lg font-medium"
      >
        <Io.IoIosArrowBack />
        뒤로가기
      </Link>

      <form className="flex flex-col mt-4 w-full"></form>
    </div>
  );
}
