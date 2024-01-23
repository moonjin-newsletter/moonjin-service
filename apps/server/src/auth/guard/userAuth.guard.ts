import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {ExceptionList} from "../../response/error/errorInstances";
import {UtilService} from "../../util/util.service";
import {UserDto} from "../dto/user.dto";

/**
 * User Auth Guard
 *
 * 1) 요청 객체를 불러오고, cookie로 부터 토큰을 가져온다
 * 2) 토큰을 통해 사용할 수 있는 데이터로 반환한다.
 * 3) 해당 데이터를 요청 객체에 담는다
 * @param context
 * @return boolean
 * @throws TOKEN_NOT_FOUND
 * @throws INVALID_TOKEN
 */
@Injectable()
export class UserAuthGuard implements CanActivate {
    constructor(
        private readonly utilService: UtilService
    ) {}
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const accessToken = request.cookies["accessToken"];
        if(!accessToken) throw ExceptionList.TOKEN_NOT_FOUND;

        const {iat, exp ,...userData} = this.utilService.getDataFromJwtToken<UserDto & {iat:number,exp: number}>(accessToken);
        request.user = userData;
        return true;
    }
}