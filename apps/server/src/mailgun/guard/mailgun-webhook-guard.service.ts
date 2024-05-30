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
        const eventData = request.body?.["event-data"];

        if(!signature || !eventData) throw ExceptionList.INVALID_TOKEN;
        if(this.mailgunService.verify(signature)){
            request.webhookPayload = {
                signature,
                eventData
            }
            return true;
        }
        return false;
    }
}