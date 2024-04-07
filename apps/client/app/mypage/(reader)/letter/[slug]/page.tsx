import Link from "next/link";
import * as Io from "react-icons/io";
import ssr from "../../../../../lib/fetcher/ssr";
import { LetterWithUserDto, ResponseForm } from "@moonjin/api-types";
import { format } from "date-fns";

type pageProps = {
  slug: string;
};

export default async function Page({ params }: { params: pageProps }) {
  const [type, id] = params.slug.split("-");
  const letterId = parseInt(id, 10);

  const { data: letterInfo } = await ssr(`letter/${letterId}`).then((res) =>
    res.json<ResponseForm<LetterWithUserDto>>(),
  );

  return (
    <main className="overflow-hidden w-full max-w-[748px] flex flex-col">
      <Link
        href="/mypage/letter"
        className="w-fit pr-4 py-2  flex items-center gap-x-2.5"
      >
        <Io.IoIosArrowBack /> 뒤로가기
      </Link>
      <section className="mt-8 flex flex-col">
        <div className="flex items-end pb-4 border-b border-grayscale-200">
          <span className="text-xl font-semibold text-grayscale-700">
            {letterInfo.title}
          </span>
          <span className="ml-auto text-grayscale-500">
            {format(new Date(letterInfo.createdAt), "yyyy.MM.dd")}
          </span>
        </div>
        <ul className="flex flex-col py-5 gap-y-2 border-b border-grayscale-200">
          <li className="text-grayscale-700 font-semibold">
            보낸사람
            <span className="ml-4 text-grayscale-500 font-normal">
              {letterInfo.sender.nickname} ({letterInfo.sender.email})
            </span>
          </li>
          <li className="text-grayscale-700 font-semibold">
            받은사람
            <span className="ml-4 text-grayscale-500 font-normal">
              {letterInfo.receiver.nickname} ({letterInfo.receiver.email})
            </span>
          </li>
        </ul>
        <div className="w-full bg-grayscale-100 px-5 py-8">
          {letterInfo.content}
        </div>
        <Link
          href={`/mypage/letter/sending?receiver=${
            type === "receive"
              ? letterInfo.sender.email
              : letterInfo.receiver.email
          }`}
          className="py-2.5 px-10 bg-primary text-white w-fit ml-auto mt-8 rounded"
        >
          답장하기
        </Link>
      </section>
    </main>
  );
}
