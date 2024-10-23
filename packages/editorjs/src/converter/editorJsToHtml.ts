import { EditorBlockToHtmlTag } from "./editorBlockToHtmlTag";
import { EmailTemplate } from "../template/emailTemplate";
import type { PostWithContentAndSeriesAndWriterDto } from "@moonjin/api-types";
import type { EditorJsonDto } from "@moonjin/editorjs-types";

/**
 * Convert EditorJs Json 데이터를 Html 문서로 변환
 * @param editorJsonData
 * @param metaData
 * @constructor
 */
export function EditorJsToHtml(
  editorJsonData: EditorJsonDto,
  metaData: PostWithContentAndSeriesAndWriterDto,
  newsletterId: number,
) {
  let htmlFormer: string = `<tr>
      <td>
        <table
          role="presentation"
          border="0"
          cellpadding="0"
          cellspacing="0"
          width="100%"
        >
          <tbody>
            <tr>
              <td align="left" style="font-size: 16px; line-height:1.625 ">`;

  const htmlLetter: string = ` </td>
            </tr>
            <tr>
                <td height="16"></td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>`;

  editorJsonData.blocks.forEach((block) => {
    htmlFormer += EditorBlockToHtmlTag(block);
  });
  const sentAt = new Date()
    .setHours(new Date().getHours() + 9)
    .toString()
    .slice(0, 10)
    .replace("-", ",");

  return (
    EmailTemplate.Header.EmailNewsletterHeader(
      metaData.user.image,
      metaData.user.nickname,
      metaData.writerInfo.moonjinId + "@moonjin.site",
      metaData.post.title,
      metaData.post.subtitle,
      metaData.series?.title ?? null,
      sentAt,
      `https://moonjin.site/@${metaData.writerInfo.moonjinId}/post/${newsletterId}`,
    ) +
    htmlFormer +
    htmlLetter +
    EmailTemplate.Utils.EmailDivider() +
    EmailTemplate.Footer.EmailWriterProfile(
      metaData.user.image,
      metaData.user.nickname,
      metaData.user.description,
      `https://moonjin.site/@${metaData.writerInfo.moonjinId}`,
    ) +
    EmailTemplate.Utils.EmailDivider() +
    EmailTemplate.Footer.EmailFeedback() +
    EmailTemplate.Footer.EmailFooter()
  );
  //     EmailTemplate.Footer.EmailNewsletterFooter(
  //     `https://moonjin.site/@${metaData.writerInfo.moonjinId}/newsletter/${newsletterId}`,
  //     metaData.user.nickname,
  //     metaData.user.description,
  //       metaData.writerInfo.moonjinId
  // );
}
