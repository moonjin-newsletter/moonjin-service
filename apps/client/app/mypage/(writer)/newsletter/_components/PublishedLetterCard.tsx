import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import type { NewsletterCardDto } from "@moonjin/api-types";
import { BiLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa";

export function PublishedLetterCard({ letter }: { letter: NewsletterCardDto }) {
  return (
    <Link
      href={`/write/${letter.post.id}/edit`}
      className="flex items-center w-full group justify-between gap-x-5 border-b py-6 h-fit overflow-hidden"
    >
      <div className="min-h-[120px] flex flex-col w-full h-full grow">
        {letter?.series && (
          <span className="text-[13px] w-fit text-primary border-primary border-b">
            {letter?.series?.title}
          </span>
        )}
        <h2 className="group-hover:underline mt-1.5 text-lg text-grayscale-600 font-medium">
          {letter.post.title}
        </h2>
        <div className="mt-0.5 w-full flex  text-sm text-grayscale-400">
          <span className="line-clamp-2">{letter.post.preview}</span>
        </div>

        <div className="mt-auto flex items-center gap-x-3 text-[#999999] text-sm">
          <div className=" flex items-center gap-x-1 ">
            <BiLike />
            <span>{letter.newsletter.likes}</span>
          </div>
          <div className="flex items-center gap-x-1">
            <FaRegCommentDots />
            <span>{letter.newsletter.comments}</span>
          </div>
          <div className="flex items-center gap-x-1.5">
            <span>발행일자</span>
            <span>
              {format(new Date(letter.newsletter.sentAt), "yyyy.MM.dd")}
            </span>
          </div>
        </div>
      </div>
      <Image
        src={letter.post.cover}
        alt="뉴스레터 커버이미지"
        width={120}
        height={120}
        className="w-[120px] h-[120px] min-w-[120px] rounded"
      />
    </Link>
  );
}
