import ssr from "../../../../lib/fetcher/ssr";
import { FollowingWriterDto, ResponseForm } from "@moonjin/api-types";
import { isNonEmptyArray, isNotNil } from "@toss/utils";
import WriterCard from "../../_components/WriterCard";

export default async function Page() {
  const writerList = await ssr("user/following").then((res) =>
    res.json<ResponseForm<FollowingWriterDto[]>>()
  );

  return (
    <main className="flex flex-col w-full">
      <div className="flex ">
        <div className="border-b font-semibold border-primary">구독한 작가</div>
        <div className="py-1 font-semibold px-2 ml-2 text-sm rounded bg-gray-200 text-gray-400">
          {isNotNil(writerList) ? writerList.data.length : 0}
        </div>
      </div>
      <section className="flex w-full mt-4">
        {isNonEmptyArray(writerList.data ?? []) ? (
          writerList.data.map((writer, index) => (
            <WriterCard writerInfo={writer} />
          ))
        ) : (
          <div>구독한 작가가 없습니다</div>
        )}
      </section>
    </main>
  );
}
