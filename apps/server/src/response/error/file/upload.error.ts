import {ERROR} from "../error";
import {ErrorCodeEnum} from "../enum/errorCode.enum";


export interface FILE_EXTENTION_ERROR extends ERROR {
    result : false;
    code : ErrorCodeEnum.FILE_EXTENTION_ERROR;
    httpStatus: 403;
    data : {
        message : "파일을 업로드할 수 없습니다. 확장자를 확인해주세요."
    };
}

export interface FILE_UPLOAD_ERROR extends ERROR {
    result : false;
    code : ErrorCodeEnum.FILE_UPLOAD_ERROR;
    httpStatus: 403;
    data : {
        message : "파일을 업로드할 수 없습니다."
    };
}