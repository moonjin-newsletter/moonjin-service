import WriterHeader from "../../_components/WriterHeader";

type pageProps = {
  params: {
    writer: string;
    id: string;
  };
};

export default async function Page({ params }: pageProps) {
  return (
    <>
      <WriterHeader />
      <main className="w-full flex flex-col items-center  ">
        <section className="max-w-[760px] w-full flex flex-col mx-auto mt-20 pb-8"></section>
      </main>
    </>
  );
}
