import {ERROR} from "../error";
import {ErrorCodeEnum} from "../enum/errorCode.enum";

export interface CREATE_SERIES_ERROR extends ERROR {
    result : false;
    code: ErrorCodeEnum.CREATE_SERIES_ERROR;
    httpStatus: 403;
    data: {
        message:"시리즈를 생성할 수 없습니다."
    }
}

export interface SERIES_NOT_FOUND extends ERROR {
    result : false;
    code: ErrorCodeEnum.SERIES_NOT_FOUND;
    httpStatus: 404;
    data: {
        message:"해당하는 시리즈가 없습니다."
    }
}

export interface FORBIDDEN_FOR_SERIES extends ERROR {
    result : false;
    code: ErrorCodeEnum.FORBIDDEN_FOR_SERIES;
    httpStatus: 403;
    data: {
        message:"해당 시리즈에 접근할 수 없습니다."
    }
}