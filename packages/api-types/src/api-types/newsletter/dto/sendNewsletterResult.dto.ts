

export interface SendNewsletterResultDto {
    newsletter : {
        id: number;
        title: string
        sentAt: Date;
        deliveredCount: number;
        totalSentCount: number;
    },
    post :{
        cover: string;
    }
}