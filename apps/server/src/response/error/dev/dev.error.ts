import {ERROR} from "../error";
import {ErrorCodeEnum} from "../enum/errorCode.enum";


export interface EMPTY_LIST_INPUT extends ERROR {
    result : false;
    code: ErrorCodeEnum.EMPTY_LIST_INPUT;
    httpStatus: 403;
    data: {
        message:"빈 리스트가 입력 되었습니다."
    }
}

export interface EMPTY_VALUE_INPUT extends ERROR {
    result : false;
    code: ErrorCodeEnum.EMPTY_VALUE_INPUT;
    httpStatus: 400;
    data: {
        message:"빈 값이 함수에 전달되었습니다."
    }
}