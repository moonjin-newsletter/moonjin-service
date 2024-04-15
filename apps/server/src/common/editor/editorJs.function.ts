import {CheckListBlockDto, EditorBlockDto, EditorJsonDto, EditorTextBlockDto, ListBlockDto} from "./dto";

export function convertEditorJsonToPostPreview(editorJson : EditorJsonDto): string{
    let preview = "";
    let MAX_PREVIEW_LENGTH = 256;

    editorJson.blocks.forEach(block => {
        if(preview.length > MAX_PREVIEW_LENGTH) return;
        if(assertTextBlock(block)){
            preview += (block.data.text + " ");
        }else if(assertListBlock(block)){
            preview += block.data.items.join(" ");
        }else if(assertCheckListBlock(block)){
            const checkBoxList = block.data.items;
            checkBoxList.forEach(checkBox => {
                if(preview.length > MAX_PREVIEW_LENGTH) return;
                preview += (checkBox.text + " ");
            })
        }
    })
    return preview;
}

export function assertTextBlock(block : EditorBlockDto): block is EditorTextBlockDto{
    return block && typeof block.data === "object" && "text" in block.data && typeof block.data.text === "string";
}

export function assertListBlock(block : EditorBlockDto): block is ListBlockDto{
    return block && typeof block.data === "object" && "items" in block.data && Array.isArray(block.data.items);
}

export function assertCheckListBlock(block : EditorBlockDto): block is CheckListBlockDto{
    return block && typeof block.data === "object" && "items" in block.data && Array.isArray(block.data.items) && "text" in block.data.items;
}