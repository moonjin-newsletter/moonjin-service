import {EditorBlockDto, EditorJsonDto} from "../type";


/**
 * @summary object가 EditorJsonDto 형식인지 확인
 * @param object
 * @constructor
 */
export function AssertEditorJsonDto(object: Object) : object is EditorJsonDto{
    return "time" in object && "version" in object && "blocks" in object && Array.isArray(object.blocks)
        && typeof object.time === "number" && typeof object.version === "string";
}