import { EditorBlockDto } from "@moonjin/editorjs-types";

/**
 * @summary editorBlock을 html tag로 변환
 * @param block
 * @constructor
 */
export function EditorBlockToHtmlTag(block: EditorBlockDto) {
  switch (block.type) {
    case "header":
      return `<h${block.data.level} style="display: block; color: #1a1a1a;   margin: 8px 0 8px 0; text-align: left;">${block.data.text}</h${block.data.level}>`;
    case "embed":
      return `<div><iframe width="560" height="315" src="${block.data.embed}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>`;
    case "paragraph":
      return `<p style="color: #1a1a1a; font-size:16px;line-height:26px;word-break:break-word;overflow-wrap: break-word; margin:8px 0 8px 0; text-align: left;">${
        block.data.text || "&nbsp;"
      }</p>`;
    case "list":
      return ListRender(block.data.items, block.data.style);
    case "delimiter":
      return "<hr style='border-width: 1px 0 0 0; border-color: #E9E9E9; width: 100%; margin: 20px 0' />";
    case "image":
      return `
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tbody>
                    <tr>
                        <td align="center" width="${
                          block.data.withBackground ? "20%" : "0"
                        }"></td>
                        <td align="center" style="">
                        <img  src="${
                          block.data.file.url
                        }" title="${block.data.caption}"
                         alt="image"
                         width="100%" style="margin: 0 auto;
                        
                        ${
                          block.data.withBorder
                            ? "border: 1px solid #efefef;"
                            : ""
                        }
                        "  />
                        <figcaption style="margin-top:10px;text-align:center;color:#757575;font-size:14px;line-height:20px">${
                          block.data.caption
                        }</figcaption>
                        </td>
                        <td align="center" width="${
                          block.data.withBackground ? "20%" : "0"
                        }"></td>
                    </tr>
                
                </tbody>
               </table>

`;
    case "checklist":
    case "linkTool":
    case "quote":
    default:
      console.log("Unknown block type", block.type);
      return "";
  }
}

function ListRender(
  items: any[],
  style: "ordered" | "unordered" | undefined,
  depth: number = 0,
) {
  let convertedHtml =
    style === "ordered"
      ? `<ol type='${depth === 0 ? "1" : "i"}' style='margin: 8px 0 8px 6px; font-size: 16px; padding-left: 12px; list-style-position: outside; '>`
      : `<ul  style='margin: 8px 0 8px 6px; font-size: 16px; padding-left: 12px; list-style-position: outside; '>`;
  items.forEach((li) => {
    convertedHtml += `<li>${li.content}</li>`;
    if (li.items && li.items.length > 0) {
      convertedHtml += ListRender(li.items, style);
    }
  });
  convertedHtml += style === "ordered" ? "</ol>" : "</ul>";

  return convertedHtml;
}
