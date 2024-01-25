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
