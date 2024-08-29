type pageProps = {
  params: { id: string };
};

export default function Page({ params }: pageProps) {
  const postId = parseInt(params.id, 10);

  return (
    <main className=" w-full  flex flex-col items-center">
      <section className="w-full max-w-[670px] mt-4 text-grayscale-500">
        <div id="editorjs" className="w-full"></div>
      </section>
    </main>
  );
}
