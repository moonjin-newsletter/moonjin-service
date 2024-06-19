import { notFound } from "next/navigation";
import WriterProfile from "./_components/WriterProfile";
import WriterTab from "./_components/WriterTab";
import WriterHeader from "./_components/WriterHeader";

type pageProps = {
  params: {
    writer: string;
  };
};

export default function Page({ params }: pageProps) {
  const [, name] = decodeURI(params.writer).split("%40");
  if (!name) notFound();

  return (
    <>
      <WriterHeader />
      <main className="w-full flex flex-col items-center  ">
        <section className="max-w-[800px] w-full flex flex-col mx-auto mt-24">
          <WriterProfile />
          <WriterTab />
        </section>
      </main>
    </>
  );
}
