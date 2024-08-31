
import {AssertEditorJsonDto} from "./assertEditorJsonDto";
import {EditorJsonDto} from "@moonjin/editorjs-types";


/**
 * @summary object를 EditorJsonDto 형식으로 변환
 * @param object
 */
export function ObjectToEditorJsonDto(object: Object): EditorJsonDto{
    if(AssertEditorJsonDto(object)){
        return object;
    }else{
        return Object.assign<EditorJsonDto, object>({
            time : 0,
            blocks: [],
            version: "2.19.0"
        }, object);
    }
}