import { notFound } from "next/navigation";
import WriterProfile from "./_components/WriterProfile";
import WriterTab from "./_components/WriterTab";
import WriterHeader from "./_components/WriterHeader";
import { nfetch } from "@lib/fetcher/noAuth";
import type { ResponseForm, WriterPublicCardDto } from "@moonjin/api-types";
import Footer from "@components/layout/Footer";
import { Metadata, ResolvingMetadata } from "next";

type pageProps = {
  params: {
    writer: string;
  };
};

export const revalidate = 0;

export async function generateMetadata(
  { params }: pageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const [, moonjinId] = decodeURI(params.writer).split("%40");

  const writerInfo = await nfetch<ResponseForm<WriterPublicCardDto>>(
    `writer/${moonjinId}/info/public`,
  );

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: writerInfo.data.user.nickname,
    description: writerInfo.data.user.description,
    keywords: [
      "뉴스레터",
      "문진",
      "글",
      "이야기",
      "moonjin",
      "메일",
      "인기 뉴스레터",
    ],
    openGraph: {
      title: writerInfo.data.user.nickname,
      description: writerInfo.data.user.description,
      images: [writerInfo.data.user.image, ...previousImages, "/og-image.png"],
    },
  };
}

export default async function Page({ params }: pageProps) {
  const [, moonjinId] = decodeURI(params.writer).split("%40");
  if (!moonjinId) notFound();

  const writerInfo = await nfetch<ResponseForm<WriterPublicCardDto>>(
    `writer/${moonjinId}/info/public`,
  );

  return (
    <div className="bg-grayscale-100 min-h-screen">
      <WriterHeader />
      <main className="w-full flex flex-col items-center pb-20">
        <section className="max-w-[800px] w-full flex flex-col mx-auto mt-10 pb-8 bg-white px-12 pt-14 rounded-xl shadow">
          <WriterProfile writerInfo={writerInfo.data} />
          <WriterTab moonjinId={moonjinId} />
        </section>
      </main>
      <Footer />
    </div>
  );
}
