import {ERROR} from "../error";
import {ErrorCodeEnum} from "../enum/errorCode.enum";

export interface CREATE_POST_ERROR extends ERROR {
    result : false;
    code: ErrorCodeEnum.CREATE_POST_ERROR;
    httpStatus: 403;
    data: {
        message:"글을 작성할 수 없습니다."
    }
}

export interface POST_NOT_FOUND extends ERROR {
    result : false;
    code: ErrorCodeEnum.POST_NOT_FOUND;
    httpStatus: 404;
    data: {
        message:"해당하는 글을 찾을 수 없습니다."
    }
}

export interface NOT_ACCESSED_FOR_POST extends ERROR {
    result : false;
    code: ErrorCodeEnum.NOT_ACCESSED_FOR_POST;
    httpStatus: 403;
    data: {
        message:"해당 글에 권한이 없습니다."
    }
}
