import {ERROR} from "../error";
import {ErrorCodeEnum} from "../enum/errorCode.enum";

export interface SEND_LETTER_ERROR extends ERROR {
    result : false;
    code : ErrorCodeEnum.SEND_LETTER_ERROR;
    httpStatus: 403;
    data : {
        message : "해당 편지를 보낼 수 없습니다."
    };
}



