"use client";
import Link from "next/link";
import * as Io from "react-icons/io";
import * as Io5 from "react-icons/io5";
import { useForm } from "react-hook-form";
import { Listbox } from "@headlessui/react";
import { useEffect, useState } from "react";
import {
  FileTypeEnum,
  type ResponseForm,
  type SeriesDto,
} from "@moonjin/api-types";
import Image from "next/image";
import toast from "react-hot-toast";
import { notFound, useRouter } from "next/navigation";
import csr from "@lib/fetcher/csr";
import { fileUpload } from "@lib/file/fileUpload";
import useSWR from "swr";
import { CategoryList } from "@components/category/CategoryList";

type pageProps = {
  params: {
    id: string;
  };
};

export default function Page({ params }: pageProps) {
  const seriesId = parseInt(params.id, 10);
  const { data: seriesInfo, error } = useSWR<ResponseForm<SeriesDto>>(
    `series/writing/${seriesId}`,
  );

  if (error) {
    notFound();
  }

  const [coverImage, setCoverImage] = useState<any>(seriesInfo?.data?.cover);
  const { watch, register, setValue, handleSubmit } = useForm<any>({
    defaultValues: {
      title: seriesInfo?.data?.title,
      description: seriesInfo?.data?.description,
      category: seriesInfo?.data?.category,
      cover: seriesInfo?.data?.cover,
    },
  });
  const category = watch("category");

  register("cover", { required: "커버가 필요해요" });

  function submitSeries(value: any) {
    csr
      .patch(`series/${seriesId}`, { json: { ...value } })
      .then((res) => {
        window.location.href = `/mypage/newsletter/series/${seriesId}`;
        return toast.success("시리즈 정보수정 완료");
      })
      .catch(() => toast.error("시리즈 정보수정 실패"));
  }

  useEffect(() => {
    if (seriesInfo) {
      setValue("title", seriesInfo?.data?.title);
      setValue("description", seriesInfo?.data?.description);
      setValue("category", seriesInfo?.data?.category);
      setValue("cover", seriesInfo?.data?.cover);
      setCoverImage(seriesInfo?.data?.cover);
    }
  }, [seriesInfo]);

  return (
    <div className="overflow-hidden w-full max-w-[748px]">
      <Link
        href={`/mypage/newsletter/series/${seriesId}`}
        className="flex gap-x-1 items-center text-grayscale-700 text-lg font-medium"
      >
        <Io.IoIosArrowBack />
        뒤로가기
      </Link>

      <form
        onSubmit={handleSubmit(submitSeries)}
        className="flex flex-col mt-8 w-full"
      >
        <label
          htmlFor="title"
          className="text-sm font-medium text-grayscale-500"
        >
          시리즈 이름
        </label>
        <input
          id="title"
          {...register("title", { required: "시리즈 이름을 입력해주세요" })}
          type="text"
          placeholder="시리즈 이름을 입력해주세요"
          className="border-none ring-0 focus:ring-0 bg-grayscale-100 rounded mt-2"
        />
        <label
          htmlFor="description"
          className="text-sm mt-8 font-medium text-grayscale-500"
        >
          시리즈 설명
        </label>
        <input
          id="description"
          {...register("description", {
            required: "시리즈 설명을 입력해주세요",
          })}
          placeholder="시리즈 설명을 입력해주세요"
          type="text"
          className="border-none ring-0 focus:ring-0 bg-grayscale-100 rounded mt-2"
        />
        <label
          htmlFor="category"
          className="text-sm mt-8 font-medium text-grayscale-500"
        >
          카테고리
        </label>
        <Listbox
          value={category}
          onChange={(value) => setValue("category", value)}
        >
          <Listbox.Button className="flex items-center justify-between px-4 mt-4 py-2 max-w-[240px] bg-grayscale-100">
            {category} <Io.IoIosArrowDown />
          </Listbox.Button>
          <Listbox.Options className=" rounded mt-2 cursor-pointer border max-w-[240px] border-gray-200">
            {CategoryList.map((item, idx) => (
              <Listbox.Option
                key={idx}
                value={item}
                className={`px-4 border-b py-2`}
              >
                {item}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
        <span className="text-sm mt-8 font-medium text-grayscale-500">
          커버 이미지
        </span>
        {coverImage ? (
          <Image
            onClick={(e) => {
              setCoverImage(null);
              setValue("cover", null);
            }}
            src={coverImage}
            alt="커버이미지"
            width={200}
            height={200}
            className="w-48 mt-2 cursor-pointer h-56 bg-grayscale-400  object-cover border border-grayscale-200 rounded"
          />
        ) : (
          <label
            htmlFor="cover"
            className="w-48 flex flex-col items-center justify-center mt-2 cursor-pointer h-56 bg-grayscale-300 rounded"
          >
            <Io5.IoImageOutline className="text-3xl" />

            <span className="mt-3 ">썸네일 업로드</span>
          </label>
        )}

        <input
          onChange={async (e) => {
            if (e?.target?.files) {
              try {
                const fileUrl = await fileUpload(
                  e.target.files[0],
                  FileTypeEnum.COVER_IMAGE,
                );
                setCoverImage(URL.createObjectURL(e.target.files[0]));
                setValue("cover", fileUrl?.file);
              } catch (e) {
                toast.error("이미지 업로드 실패");
                setCoverImage(null);
              }
            }
          }}
          id="cover"
          multiple={false}
          type="file"
          accept="image/*"
          className="hidden"
        />
        <button
          type="submit"
          className="py-3 mt-8 w-full flex items-center justify-center font-medium text-white bg-primary rounded"
        >
          시리즈 정보수정
        </button>
      </form>
    </div>
  );
}
