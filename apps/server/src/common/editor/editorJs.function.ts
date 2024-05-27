import {CheckListBlockDto, EditorBlockDto, EditorJsonDto, EditorTextBlockDto, ListBlockDto} from "./dto";

export function convertEditorJsonToPostPreview(editorJson : EditorJsonDto): string{
    let preview = "";
    let MAX_PREVIEW_LENGTH = 256;

    editorJson.blocks.forEach(block => {
        if(preview.length > MAX_PREVIEW_LENGTH) return;
        if(assertTextBlock(block)){
            preview += (block.data.text + " ").trim();
        }else if(assertListBlock(block)){
            block.data.items.map(item => {
                if(preview.length > MAX_PREVIEW_LENGTH) return;
                preview += ( "·" + item.content.trim() + " ");
            })
        }else if(assertCheckListBlock(block)){
            const checkBoxList = block.data.items;
            checkBoxList.forEach(checkBox => {
                if(preview.length > MAX_PREVIEW_LENGTH) return;
                preview += (checkBox.text.trim() + " ");
            })
        }
    })
    if(preview.length < MAX_PREVIEW_LENGTH)
        return preview
    else {
        return preview.substring(0, MAX_PREVIEW_LENGTH-4) + "...";
    }
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