export interface IMailgunEventData {
    id : string;
    event: string;
    timestamp : number;
    recipient : string;
    "user-variables" : {
        "newsletter-id" : string
    }
}