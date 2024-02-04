import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {ExceptionList} from "../../response/error/errorInstances";
import {UserAuthDto} from "../dto/userAuthDto";
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
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const accessToken = request.cookies["accessToken"];
        if(!accessToken) throw ExceptionList.TOKEN_NOT_FOUND;

        try {
            const {iat, exp ,...userData} = this.authService.getDataFromJwtToken<UserAuthDto>(accessToken);
            await this.authValidationService.assertWriter(userData.id)
            request.user = userData;
            return true;
        } catch (error){
            if(error === ExceptionList.USER_NOT_WRITER) throw error;
            throw ExceptionList.INVALID_TOKEN;
        }
    }
}