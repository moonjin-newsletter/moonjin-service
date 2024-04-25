export interface sendNewsLetterWithHtmlDto {
    emailList: string[];
    senderName: string;
    senderMailAddress: string;
    subject: string;
    html: string;
}