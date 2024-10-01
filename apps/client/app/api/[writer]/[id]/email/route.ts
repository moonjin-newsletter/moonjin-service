import { nfetch } from "@lib/fetcher/noAuth";
import { NewsletterAllDataDto, ResponseForm } from "@moonjin/api-types";
import { EditorJsToHtml } from "@moonjin/editorjs";

type searchParams = {
  writer: string;
  id: string;
};

export async function GET(request: Request, context: { params: searchParams }) {
  const [, moonjinId] = context.params.writer.split("@");
  const nId = parseInt(context.params.id, 10);
  const { data: nInfo } = await nfetch<ResponseForm<NewsletterAllDataDto>>(
    `writer/${moonjinId}/newsletter/${nId}`,
  );

  const html = EditorJsToHtml(
    nInfo.postContent.content,
    {
      series: nInfo.series,
      post: nInfo.post,
      postContent: nInfo.postContent,
      user: { ...nInfo.writer.user, email: `${moonjinId}@gmail.com` },
      writerInfo: nInfo.writer.writerInfo,
    },
    nId,
  );

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=UTF-8" },
  });
}
