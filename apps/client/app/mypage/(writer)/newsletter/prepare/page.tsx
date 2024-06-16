import { isNonEmptyArray, isNotNil } from "@toss/utils";
import ssr from "../../../../../lib/fetcher/ssr";
import type { ResponseForm, PostWithSeriesDto } from "@moonjin/api-types";
import EmptyCard from "../../../_components/EmptyCard";
import { UnreleasedNewsletterCard } from "../_components/UnreleasedCard";

export default async function Page() {
  const { data: writingPostList } = await ssr("post/writing").then((res) =>
    res.json<ResponseForm<PostWithSeriesDto[]>>(),
  );

  return (
    <main className="overflow-hidden w-full max-w-[748px]">
      <div className="flex ">
        <div className="border-b font-semibold border-primary">
          작성중인 뉴스레터
        </div>
        <div className="py-0.5 px-2 h-fit font-semibold  ml-2 text-sm rounded bg-primary text-white">
          {isNotNil(writingPostList) ? writingPostList.length : 0}
        </div>
      </div>
      <section className="flex flex-col w-full ">
        {isNonEmptyArray(writingPostList ?? []) ? (
          writingPostList.map((post, index) => (
            <UnreleasedNewsletterCard value={post} />
          ))
        ) : (
          <EmptyCard text={"작성 중인 글이 없습니다"} />
        )}
      </section>
    </main>
  );
}
