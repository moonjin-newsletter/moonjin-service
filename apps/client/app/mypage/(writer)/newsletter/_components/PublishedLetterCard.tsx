import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import type { NewsletterCardDto } from "@moonjin/api-types";
import { LogoSymbolGray } from "@components/icons";

export function PublishedLetterCard({ letter }: { letter: NewsletterCardDto }) {
  return (
    <Link
      href={`/@${letter.writer.moonjinId}/post/${letter.newsletter.id}`}
      className="flex items-center w-full group justify-between gap-x-5 border-b py-6 h-fit overflow-hidden"
    >
      <div className="min-h-[120px] flex flex-col w-full h-full grow gap-y-2">
        {letter?.series && (
          <span className="text-[13px] w-fit text-primary border-primary border-b">
            {letter?.series?.title}
          </span>
        )}
        <h2 className="group-hover:underline  text-lg text-grayscale-600 font-semibold font-serif">
          {letter.post.title}
        </h2>
        <div className=" w-full h-full grow flex flex-col gap-y-2">
          <div className=" w-full flex  text-sm text-grayscale-400">
            <span className="line-clamp-2">{letter.post.subtitle}</span>
          </div>

          <div className="mt-auto flex items-center gap-x-3 text-[#999999] text-sm">
            <div className=" flex items-center gap-x-1 ">
              <LogoSymbolGray width="18" height="18" viewBox="0 0 24 24" />
              <span>{letter.newsletter.likes}</span>
            </div>
            {/*<div className="flex items-center gap-x-1">*/}
            {/*  <FaRegCommentDots />*/}
            {/*  <span>{letter.newsletter.comments}</span>*/}
            {/*</div>*/}
            <div className="flex items-center gap-x-1.5">
              <span>발행일자</span>
              <span>
                {format(new Date(letter.newsletter.sentAt), "yyyy.MM.dd")}
              </span>
            </div>
          </div>
        </div>
      </div>
      <Image
        src={letter.post.cover}
        alt="뉴스레터 커버이미지"
        width={120}
        height={120}
        className="w-[120px] h-[120px] min-w-[120px] rounded object-cover border border-grayscale-100"
      />
    </Link>
  );
}
