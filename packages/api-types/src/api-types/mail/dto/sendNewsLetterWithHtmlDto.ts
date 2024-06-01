export interface sendNewsLetterWithHtmlDto {
    newsletterId : number;
    emailList: string[];
    senderName: string;
    senderMailAddress: string;
    subject: string;
    html: string;
}