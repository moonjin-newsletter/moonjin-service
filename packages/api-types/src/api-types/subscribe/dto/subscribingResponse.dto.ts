export type SubscribingResponseDto = SubscribingStatusResponseDto | NotSubscribingStatusResponseDto | IsMeStatusReponseDto;

export interface SubscribingStatusResponseDto {
    isSubscribing: true;
    createdAt: Date;
}

export interface NotSubscribingStatusResponseDto {
    isSubscribing: false;
    isMe : false;
}

export interface IsMeStatusReponseDto{
    isSubscribing: false;
    isMe : true;
}