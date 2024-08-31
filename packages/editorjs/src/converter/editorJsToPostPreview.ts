import {EditorBlockDto} from "@moonjin/editorjs-types";

/**
 * @summary EditorJson -> Post Preview (서버용)
 * @param editorJsBlocks
 * @constructor
 */
export function EditorJsToPostPreview (editorJsBlocks : EditorBlockDto[]){
    let preview = "";
    let MAX_PREVIEW_LENGTH = 256;

    editorJsBlocks.forEach(block => {
        if(preview.length > MAX_PREVIEW_LENGTH) return;

        switch (block.type) {
            case "paragraph":
                preview += (block.data.text.trim() + " ");
                break;
            case "list":
                block.data.items.map(item => {
                    if(preview.length > MAX_PREVIEW_LENGTH) return;
                    preview += ( "·" + item.content.trim() + " ");
                })
                break;
            case "checklist":
                block.data.items.forEach(checkBox => {
                    if(preview.length > MAX_PREVIEW_LENGTH) return;
                    preview += (checkBox.text.trim() + " ");
                })
                break;
        }
    })
    return preview.length >= MAX_PREVIEW_LENGTH ? preview.substring(0, MAX_PREVIEW_LENGTH-4) + "..." : preview;
}