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