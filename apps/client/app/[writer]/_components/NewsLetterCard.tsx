import Link from "next/link";
import { NewsletterCardDto } from "@moonjin/api-types";
import Image from "next/image";
import { BiLike } from "react-icons/bi";
import { FaRegCommentDots } from "react-icons/fa";
import { format } from "date-fns";

export default function NewsLetterCard({
  newsletterInfo,
}: {
  newsletterInfo: NewsletterCardDto;
}) {
  return (
    <Link
      href={`/@${newsletterInfo.writer.moonjinId}/post/${newsletterInfo.newsletter.id}`}
      className="flex items-center w-full group justify-between gap-x-5 border-b py-6 h-fit overflow-hidden"
    >
      <div className=" flex flex-col w-full h-full grow">
        {newsletterInfo?.series && (
          <span className="text-[13px] w-fit text-primary border-primary border-b">
            {newsletterInfo?.series?.title}
          </span>
        )}
        <h2 className="group-hover:underline mt-1.5 text-lg text-grayscale-600 font-medium">
          {newsletterInfo.post.title}
        </h2>
        <div className="mt-0.5 w-full flex  text-sm text-grayscale-400">
          <span className="line-clamp-2">{newsletterInfo.post.preview}</span>
        </div>
        <div className="mt-3 flex items-center gap-x-3 text-[#999999] text-sm">
          <div className="flex items-center gap-x-1 ">
            <BiLike />
            <span>{newsletterInfo.newsletter.likes}</span>
          </div>
          <div className="flex items-center gap-x-1">
            <FaRegCommentDots />
            <span>{newsletterInfo.newsletter.comments}</span>
          </div>
          <div className="flex items-center gap-x-1.5">
            <span>발행일자</span>
            <span>
              {format(new Date(newsletterInfo.newsletter.sentAt), "yyyy.MM.dd")}
            </span>
          </div>
        </div>
      </div>
      <Image
        src={newsletterInfo.post.cover}
        alt="뉴스레터 커버이미지"
        width={120}
        height={120}
        className="w-[120px] h-[120px] min-w-[120px] rounded"
      />
    </Link>
  );
}
