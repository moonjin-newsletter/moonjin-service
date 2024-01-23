export interface CreatePostDto {
    title: string;
    content: string;
    category: string;
    writerId: number;
    cover?: string;
    seriesId? : number;
    status?: boolean;
    releasedAt?: Date;
}