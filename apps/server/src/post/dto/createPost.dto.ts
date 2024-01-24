export interface CreatePostDto {
    title: string;
    content: string;
    category: string;
    writerId: number;
    status: boolean;
    cover?: string;
    seriesId? : number;
    releasedAt?: Date;
}