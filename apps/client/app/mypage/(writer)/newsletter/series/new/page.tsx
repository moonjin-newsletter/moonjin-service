"use client";
import Link from "next/link";
import * as Io from "react-icons/io";
import * as Io5 from "react-icons/io5";
import { useForm } from "react-hook-form";
import { Listbox } from "@headlessui/react";
import { useState } from "react";
import { fileUpload } from "../../../../../../lib/file/fileUpload";
import { FileTypeEnum } from "@moonjin/api-types";
import Image from "next/image";
import toast from "react-hot-toast";
import csr from "../../../../../../lib/fetcher/csr";
import { useRouter } from "next/navigation";
import { CategoryList } from "@components/category/CategoryList";

export default function Page() {
  const [coverImage, setCoverImage] = useState<any>(null);
  const {
    watch,
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      category: CategoryList[0],
    },
  });
  const router = useRouter();
  const category = watch("category");

  register("cover", { required: "커버 이미지를 지정해주세요" });

  function submitSeries(value: any) {
    csr
      .post("series", { json: { ...value } })
      .then((res) => {
        router.push("/mypage/newsletter/publish");
        return toast.success("새로운 시리즈 생성완료");
      })
      .catch(() => toast.error("시리즈 생성 실패"));
  }

  return (
    <div className="overflow-hidden w-full max-w-[748px]">
      <Link
        href="/mypage/newsletter/publish"
        className="flex gap-x-1 items-center text-grayscale-700 text-lg font-medium w-fit"
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
          maxLength={16}
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
          maxLength={128}
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
            className="w-48 object-cover mt-2 cursor-pointer h-56 bg-grayscale-400 rounded border border-grayscale-200"
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
        {errors.cover?.message && (
          <span className="text-xs text-rose-500 mt-1 ">{`${errors.cover?.message}`}</span>
        )}
        <button
          type="submit"
          className="py-3 mt-8 w-full flex items-center justify-center font-medium text-white bg-primary rounded"
        >
          시리즈 만들기
        </button>
      </form>
    </div>
  );
}
