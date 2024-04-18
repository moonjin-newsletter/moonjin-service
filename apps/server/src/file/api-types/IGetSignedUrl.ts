import {FileTypeEnum} from "../enum/fileType.enum";
import {tags} from "typia";

export interface IGetSignedUrl {
    fileType: FileTypeEnum;
    fileName: string & tags.MaxLength<128>;
}