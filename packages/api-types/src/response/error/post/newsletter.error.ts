import {ERROR} from "../error";
import {ErrorCodeEnum} from "../enum/errorCode.enum";


export interface SEND_NEWSLETTER_ERROR extends ERROR {
    result : false;
    code : ErrorCodeEnum.SEND_NEWSLETTER_ERROR;
    httpStatus: 403;
    data : {
        message : "해당 뉴스레터를 보낼 수 없습니다."
    };
}

export interface NEWSLETTER_CATEGORY_NOT_FOUND extends ERROR {
    result : false;
    code : ErrorCodeEnum.NEWSLETTER_CATEGORY_NOT_FOUND;
    httpStatus: 404;
    data : {
        message : "해당 뉴스레터의 카테고리를 먼저 설정해주세요."
    };
}