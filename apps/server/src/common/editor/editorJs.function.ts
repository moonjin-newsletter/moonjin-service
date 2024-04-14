import {EditorBlockDto, EditorJsonDto, EditorTextBlockDto} from "./dto";

export function convertEditorJsonToPostPreview(editorJson : EditorJsonDto): string{
    let preview = "";

    editorJson.blocks.forEach(block => {
        if(preview.length > 30) return;
        if(isTextBlock(block)){
            preview += block.data.text;
        }
    })
    return preview;
}

export function isTextBlock(block : EditorBlockDto): block is EditorTextBlockDto{
    return block && typeof block.data === "object" && "text" in block.data && typeof block.data.text === "string";
}