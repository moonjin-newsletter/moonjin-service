
export interface NewsletterSummaryDto {
    newsletter : {
        id: number;
        title: string
        sentAt: Date;
    };
    post :{
        cover: string;
    }
}