export interface LetterDto {
    id: number;
    senderId: number;
    receiverId: number;
    title: string;
    content: string;
    createdAt: Date;
    readAt: Date | null;
}