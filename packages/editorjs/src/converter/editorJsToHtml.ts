
import { EditorBlockToHtmlTag } from "./editorBlockToHtmlTag";
import {EmailTemplate} from "../template/emailTemplate";
import {NewsletterAllDataDto} from "@moonjin/api-types";
import {EditorJsonDto} from "@moonjin/editorjs-types";

/**
 * Convert EditorJs Json 데이터를 Html 문서로 변환
 * @param editorJsonData
 * @param newsletterData
 * @constructor
 */
export function EditorJsToHtml(editorJsonData: EditorJsonDto, newsletterData:NewsletterAllDataDto  ) {
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
              <td align="left">`;

  const htmlLetter: string = ` </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>`;

  editorJsonData.blocks.forEach((block) => {
    htmlFormer += EditorBlockToHtmlTag(block);
  });
  const sentAt = newsletterData.newsletter.sentAt.toString().slice(0,10).replace('-',',');

  return EmailTemplate.Header.EmailNewsletterHeader(
      newsletterData.writer.user.image, newsletterData.writer.user.nickname, newsletterData.writer.writerInfo.moonjinId + "@moonjin.site",
      newsletterData.post.title, newsletterData.series?.title?? null, sentAt,
      `https://moonjin.site/@${newsletterData.writer.writerInfo.moonjinId}/newsletter/${newsletterData.newsletter.id}`,
  )
      + htmlFormer + htmlLetter + EmailTemplate.Footer.EmailNewsletterFooter(
      `https://moonjin.site/@${newsletterData.writer.writerInfo.moonjinId}/newsletter/${newsletterData.newsletter.id}`,
      newsletterData.writer.user.nickname,
      newsletterData.writer.user.description,
        newsletterData.writer.writerInfo.moonjinId
  );
}
