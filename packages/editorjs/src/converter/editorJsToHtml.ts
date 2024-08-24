import { EditorJsonDto } from "../type";
import { EditorBlockToHtmlTag } from "./editorBlockToHtmlTag";
import { EmailTemp } from "../template";

/**
 * Convert EditorJs Json 데이터를 Html 문서로 변환
 * @param editorJsonData
 * @constructor
 */
export function EditorJsToHtml(editorJsonData: EditorJsonDto) {
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

  return EmailTemp.Header() + htmlFormer + htmlLetter + EmailTemp.Footer();
}
