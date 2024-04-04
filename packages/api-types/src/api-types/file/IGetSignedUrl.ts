import {FileTypeEnum} from "./enum/fileType.enum";

export interface IGetSignedUrl {
    fileType: FileTypeEnum;
    fileName: string;
}