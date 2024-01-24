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
