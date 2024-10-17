import Link from "next/link";
import Image from "next/image";
import { SeriesDto, WriterProfileInCardDto } from "@moonjin/api-types";
import { format } from "date-fns";

type VerticalCardProps = {
  title: string;
  subtitle: string;
  createdAt: Date;
  thumbnail: string;
  href: string;
  writer: WriterProfileInCardDto;
  series?: SeriesDto | null;
};

export default function VerticalCard({
  title,
  subtitle,
  thumbnail,
  createdAt,
  href,
  writer,
  series,
}: VerticalCardProps) {
  return (
    <Link href={href} className="w-[232px] flex flex-col group ">
      <div className="relative overflow-hidden rounded-lg">
        <Image
          src={thumbnail}
          width={232}
          height={232}
          alt="작가이미지"
          className="bg-grayscale-200 group-hover:scale-105 w-[232px] h-[232px] rounded-lg  object-cover border border-grayscale-100 transition duration-200 ease-in-out group-hover:brightness-90"
        />
      </div>

      <div className="flex flex-col gap-y-2 mt-2">
        <span className="text-primary underline break-keep text-sm font-light ">
          {series?.title}
        </span>
        <strong className="text-left font-semibold font-serif text-lg ">
          {title}
        </strong>

        <div className="text-[14px] line-clamp-3  text-grayscale-500 ">
          {subtitle}
        </div>
      </div>

      <div className="flex items-center gap-x-2 mt-[18px]">
        <Image
          src={writer.profileImage}
          width={28}
          height={28}
          alt="작가이미지"
          className="w-7 h-7 rounded-full object-cover bg-gray-400"
        />
        <p className="text-sm text-grayscale-500">
          <span className="font-serif font-medium">by.</span>
          {writer.nickname}
        </p>
        <span className="text-sm font-light text-grayscale-500 ml-auto">
          {format(new Date(createdAt), "yyyy.MM.dd")}
        </span>
      </div>
    </Link>
  );
}
