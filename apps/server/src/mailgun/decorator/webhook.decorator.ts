import {createParamDecorator, ExecutionContext, InternalServerErrorException} from "@nestjs/common";
import {IMailgunWebhookPayload} from "../api-types/IMailgunWebhookPayload";

export const WebhookPayload = createParamDecorator((data : keyof IMailgunWebhookPayload | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const webhookPayload = request.webhookPayload as IMailgunWebhookPayload; // 가드가 선행 되어야함
    if(!webhookPayload){
        throw new InternalServerErrorException("Request에 webhook이 없습니다. Guard가 선행되어야 합니다.")
    }
    if(data)
        return webhookPayload[data];
    return webhookPayload;
});
