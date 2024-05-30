import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {ExceptionList} from "../../response/error/errorInstances";
import {MailgunService} from "../mailgun.service";


/**
 * @summary 유저의 인증을 담당하는 Guard
 * @param context
 * @return boolean
 * @throws TOKEN_NOT_FOUND
 * @throws INVALID_TOKEN
 */
@Injectable()
export class MailgunWebhookGuard implements CanActivate {
    constructor(
        private readonly mailgunService: MailgunService
    ) {}
    canActivate(context: ExecutionContext): boolean {

        const request = context.switchToHttp().getRequest();
        const signature = request.body?.signature;
        if(!signature) throw ExceptionList.INVALID_TOKEN;
        return this.mailgunService.verify(signature)
    }
}