import { EditorBlockDto } from "@moonjin/editorjs-types";

/**
 * @summary editorBlock을 html tag로 변환
 * @param block
 * @constructor
 */
export function EditorBlockToHtmlTag(block: EditorBlockDto) {
  switch (block.type) {
    case "header":
      return `<h${block.data.level} style="display: block; color: #1a1a1a;   margin: 16px 0px 9px 0px; text-align: left;">${block.data.text}</h${block.data.level}>`;
    case "embed":
      return `<div><iframe width="560" height="315" src="${block.data.embed}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>`;
    case "paragraph":
      return `<p style="color: #1a1a1a; font-size:16px;line-height:26px;word-break:break-word;overflow-wrap: break-word; margin:16px 0px 16px 0px; text-align: left;">${block.data.text}</p>`;
    case "image":
      return `
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tbody>
                    <tr>
                        <td align="center" width="${
                          block.data.withBackground ? "20%" : "0"
                        }"></td>
                        <td align="center" style="${
                          block.data.withBorder
                            ? "border: 1px solid #efefef;"
                            : ""
                        }">
                        <img class="img-fluid" src="${
                          block.data.file.url
                        }" title="${
                          block.data.caption
                        }" width="100%" style="margin: 0 auto;"  alt="image"/>
                        </td>
                        <td align="center" width="${
                          block.data.withBackground ? "20%" : "0"
                        }"></td>
                    </tr>
                </tbody>
               </table>

`;
    case "list":
      return ListRender(block.data.items, block.data.style);
    case "delimiter":
      return "<hr style='border:1px #b7b7b7 solid' />";

    case "checklist":
    case "linkTool":
    case "quote":
    default:
      console.log("Unknown block type", block.type);
      return "";
  }
}

function ListRender(items: any[], style: "ordered" | "unordered" | undefined) {
  let convertedHtml =
    style === "ordered"
      ? "<ol style='margin: 8px 0 8px 0; font-size: 16px;'>"
      : "<ul style='margin: 8px 0 8px 0; font-size: 16px;'>";
  items.forEach((li) => {
    convertedHtml += `<li>${li.content}</li>`;
    if (li.items && li.items.length > 0) {
      convertedHtml += ListRender(li.items, style);
    }
  });
  convertedHtml += style === "ordered" ? "</ol>" : "</ul>";

  return convertedHtml;
}
