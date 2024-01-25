import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {ExceptionList} from "../../response/error/errorInstances";
import {UserDto} from "../dto/user.dto";
import {AuthService} from "../auth.service";
import {AuthValidationService} from "../auth.validation.service";

/**
 * @summary 작가의 인증을 담당하는 Guard
 * @param context
 * @return boolean
 * @throws TOKEN_NOT_FOUND
 * @throws INVALID_TOKEN
 * @throws USER_NOT_WRITER
 */
@Injectable()
export class WriterAuthGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly authValidationService: AuthValidationService
    ) {}
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const accessToken = request.cookies["accessToken"];
        if(!accessToken) throw ExceptionList.TOKEN_NOT_FOUND;

        const {iat, exp ,...userData} = this.authService.getDataFromJwtToken<UserDto>(accessToken);
        if(!this.authValidationService.assertWriter(userData.id)) throw ExceptionList.USER_NOT_WRITER;
        request.user = userData;
        return true;
    }
}