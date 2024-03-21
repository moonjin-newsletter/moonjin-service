export interface LetterDto {
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    readAt: Date | null;
}