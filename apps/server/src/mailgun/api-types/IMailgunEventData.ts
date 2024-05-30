export interface IMailgunEventData {
    id : string;
    event : string;
    timestamp : string;
    recipient : string;
    "user-variables" : {
        "newsletter-id" : number
    }
}