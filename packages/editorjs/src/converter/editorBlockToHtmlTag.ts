import {EditorBlockDto} from "../type";

/**
 * @summary editorBlock을 html tag로 변환
 * @param block
 * @constructor
 */
export function EditorBlockToHtmlTag(block : EditorBlockDto){
    switch (block.type) {
        case "header":
            return `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
        case "embed":
            return `<div><iframe width="560" height="315" src="${block.data.embed}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div>`;
        case "paragraph":
            return `<p>${block.data.text}</p>`;
        case "image":
            return`<img class="img-fluid" src="${block.data.file.url}" title="${block.data.caption}" /><br /><em>${block.data.caption}</em>`;
        case "list":
            let convertedHtml = (block.data.style === "ordered") ? "<ol>" : "<ul>";
            block.data.items.forEach(li => {
                convertedHtml += `<li>${li}</li>`;
            });
            convertedHtml += (block.data.style === "ordered") ? "<ol>" : "<ul>";
            return convertedHtml;
        case "checklist":
        case "linkTool":
        case "quote":
        // case "delimiter":
        default:
            console.log("Unknown block type", block.type);
            return ""
    }
}