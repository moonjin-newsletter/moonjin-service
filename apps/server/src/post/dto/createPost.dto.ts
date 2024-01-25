export interface CreatePostDto {
    title: string;
    content: string;
    category: string;
    writerId: number;
    status: boolean;
    releasedAt? : Date;
    cover?: string;
    seriesId? : number;
}