import dynamic from "next/dynamic";
import ssr from "@lib/fetcher/ssr";
import type { NewsletterAllDataDto, ResponseForm } from "@moonjin/api-types";
import { redirect } from "next/navigation";

const UpdateEditorJS = dynamic(() => import("./_components/UpdateEditorJS"), {
  ssr: false,
});

type pageProps = {
  params: { id: string };
};

export default async function Page({ params }: pageProps) {
  const postId = parseInt(params.id, 10);

  const { data: letterData } = await ssr
    .get(`newsletter/${postId}/all`)
    .json<ResponseForm<NewsletterAllDataDto>>()
    .catch((err) => redirect("/write/new"));

  return (
    <main className=" w-full  flex flex-col items-center">
      <UpdateEditorJS letterId={postId} letterData={letterData} />
      <section className="w-full max-w-[670px] mt-4 text-grayscale-600">
        <div id="editorjs" className="w-full"></div>
      </section>
    </main>
  );
}
