import dynamic from "next/dynamic";
import ssr from "@lib/fetcher/ssr";
import type {
  PostWithContentAndSeriesDto,
  PostWithContentDto,
  ResponseForm,
} from "@moonjin/api-types";
import { redirect } from "next/navigation";

const SavedEditorJS = dynamic(() => import("./_components/SavedEditorJS"), {
  ssr: false,
});

type pageProps = {
  params: { id: string };
};

export default async function Page({ params }: pageProps) {
  const letterId = parseInt(params.id, 10);
  const { data: letterData } = await ssr
    .get(`post/${letterId}`)
    .then((res) =>
      res.json<
        ResponseForm<PostWithContentDto | PostWithContentAndSeriesDto>
      >(),
    )
    .catch((err) => redirect("/write/new"));

  return (
    <main className=" w-full    flex flex-col items-center">
      <SavedEditorJS letterId={letterId} letterData={letterData} />
      <section className="w-full max-w-[670px] mt-4 text-grayscale-500">
        <div id="editorjs" className="w-full"></div>
      </section>
    </main>
  );
}
