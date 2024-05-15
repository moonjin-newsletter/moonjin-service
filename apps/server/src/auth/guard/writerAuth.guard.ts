import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {ExceptionList} from "../../response/error/errorInstances";
import {UserAuthDto} from "../dto";
import {AuthValidationService} from "../auth.validation.service";
import {JwtUtilService} from "../jwtUtil.service";

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
        private readonly jwtUtilService: JwtUtilService,
        private readonly authValidationService: AuthValidationService
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const accessToken = request.cookies["accessToken"];
        if(!accessToken) throw ExceptionList.TOKEN_NOT_FOUND;

        try {
            const {iat, exp ,...userData} = this.jwtUtilService.getDataFromJwtToken<UserAuthDto>(accessToken);
            await this.authValidationService.assertWriter(userData.id)
            request.user = userData;
            return true;
        } catch (error){
            if(error === ExceptionList.USER_NOT_WRITER) throw error;
            throw ExceptionList.INVALID_TOKEN;
        }
    }
}