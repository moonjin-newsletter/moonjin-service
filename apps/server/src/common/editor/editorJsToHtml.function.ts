import edjsHTML from "editorjs-html";
import {PostContentDto} from "../../post/dto";

export function editorJsToHtml(editorJs : PostContentDto): string{
    let htmlFormer = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Title</title></head><body>`
    const htmlLetter = `</body></html>`
    const edjsParser = edjsHTML();
    const content = edjsParser.parse(editorJs.content);
    content.forEach(cont => {
        htmlFormer += cont;
    })
    return htmlFormer + htmlLetter;
}