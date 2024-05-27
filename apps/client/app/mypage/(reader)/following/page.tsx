import ssr from "../../../../lib/fetcher/ssr";
import type {
  ResponseForm,
  SubscribingWriterProfileDto,
} from "@moonjin/api-types";
import { isNonEmptyArray, isNotNil } from "@toss/utils";
import WriterCard from "../../_components/WriterCard";
import EmptyCard from "../../_components/EmptyCard";

export default async function Page() {
  const writerList = await ssr("subscribe/writer/all").then((res) =>
    res.json<ResponseForm<SubscribingWriterProfileDto[]>>(),
  );

  return (
    <main className="flex flex-col w-full">
      <div className="flex ">
        <div className="border-b font-semibold border-primary">구독한 작가</div>
        <div className="py-0.5 font-semibold px-2 ml-2 text-sm rounded bg-primary text-white">
          {isNotNil(writerList) ? writerList.data.length : 0}
        </div>
      </div>
      <section className="flex flex-col w-full mt-4">
        {isNonEmptyArray(writerList.data ?? []) ? (
          writerList.data.map((writer, index) => (
            <WriterCard writerInfo={writer} />
          ))
        ) : (
          <EmptyCard text={"구독 중인 작가가 없습니다"} />
        )}
      </section>
    </main>
  );
}
