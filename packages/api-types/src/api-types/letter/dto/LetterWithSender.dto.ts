
export interface LetterWithSenderDto {
    id: number;
    receiverId: number;
    title: string;
    content: string;
    createdAt: Date;
    readAt: Date | null;
    sender: {
        id: number;
        nickname: string;
    }
}