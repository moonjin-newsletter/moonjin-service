import {ERROR} from "../index";
import {ErrorCodeEnum} from "../enum/errorCode.enum";
import {HttpStatus} from "@nestjs/common";

export interface USER_NOT_FOUND extends ERROR {
    result : false;
    code: ErrorCodeEnum.USER_NOT_FOUND;
    httpStatus: HttpStatus.NOT_FOUND;
    data: {
        message:"해당 유저를 찾을 수 없습니다."
    }

}

export interface INVALID_PASSWORD extends ERROR {
    result : false;
    code: ErrorCodeEnum.INVALID_PASSWORD;
    httpStatus: HttpStatus.UNAUTHORIZED;
    data: {
        message:"패스워드가 다릅니다."
    }
}

export interface LOGIN_ERROR extends ERROR {
    result : false;
    code: ErrorCodeEnum.LOGIN_ERROR;
    httpStatus: HttpStatus.NOT_ACCEPTABLE;
    data: {
        message:"로그인할 수 없습니다."
    }
}
