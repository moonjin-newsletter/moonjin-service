import {EditorJsonDto} from "../type";
import {EditorBlockToHtmlTag} from "./editorBlockToHtmlTag";

/**
 * Convert EditorJs Json 데이터를 Html 문서로 변환
 * @param editorJsonData
 * @constructor
 */
export function EditorJsToHtml(editorJsonData : EditorJsonDto){
    let htmlFormer = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Title</title></head><body>`
    const htmlLetter = `</body></html>`

    editorJsonData.blocks.forEach(block => {
        htmlFormer += EditorBlockToHtmlTag(block);
    })

    return htmlFormer + htmlLetter;
}
