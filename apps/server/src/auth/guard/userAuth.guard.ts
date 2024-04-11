import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {ExceptionList} from "../../response/error/errorInstances";
import {UserAuthDto} from "../dto";
import {AuthService} from "../auth.service";

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
        private readonly authService: AuthService
    ) {}
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const accessToken = request.cookies["accessToken"];
        if(!accessToken) throw ExceptionList.TOKEN_NOT_FOUND;

        const {iat, exp ,...userData} = this.authService.getDataFromJwtToken<UserAuthDto>(accessToken);
        request.user = userData;
        return true;
    }
}