import dynamic from "next/dynamic";

const NewEditorJS = dynamic(() => import("./_components/NewEditorJS"), {
  ssr: false,
});

export default function Page() {
  return (
    <main className=" w-full    flex flex-col items-center">
      <NewEditorJS />
    </main>
  );
}
