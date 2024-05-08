import dynamic from "next/dynamic";

const NewEditorJS = dynamic(() => import("./_components/NewEditorJS"), {
  ssr: false,
});

export default function Page() {
  return (
    <main className=" w-full    flex flex-col items-center">
      <NewEditorJS />
      <section className="w-full max-w-[670px] mt-4 text-grayscale-500">
        <div id="editorjs" className="w-full"></div>
      </section>
    </main>
  );
}
