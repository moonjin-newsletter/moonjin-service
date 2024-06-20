import { notFound } from "next/navigation";
import WriterProfile from "./_components/WriterProfile";
import WriterTab from "./_components/WriterTab";
import WriterHeader from "./_components/WriterHeader";
import { nfetch } from "@lib/fetcher/noAuth";
import type { ResponseForm, WriterPublicCardDto } from "@moonjin/api-types";

type pageProps = {
  params: {
    writer: string;
  };
};

export const revalidate = 0;

export default async function Page({ params }: pageProps) {
  const [, moonjinId] = decodeURI(params.writer).split("%40");
  if (!moonjinId) notFound();

  const writerInfo = await nfetch<ResponseForm<WriterPublicCardDto>>(
    `writer/${moonjinId}/info/public`,
  );

  return (
    <>
      <WriterHeader />
      <main className="w-full flex flex-col items-center  ">
        <section className="max-w-[760px] w-full flex flex-col mx-auto mt-24">
          <WriterProfile writerInfo={writerInfo.data} />
          <WriterTab />
        </section>
      </main>
    </>
  );
}
