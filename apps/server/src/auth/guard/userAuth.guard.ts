import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {ExceptionList} from "../../response/error/errorInstances";
import {UtilService} from "../../util/util.service";
import {UserDto} from "../dto/user.dto";

/**
 * @summary 유저의 인증을 담당하는 Guard
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

        const {iat, exp ,...userData} = this.utilService.getDataFromJwtToken<UserDto>(accessToken);
        request.user = userData;
        return true;
    }
}