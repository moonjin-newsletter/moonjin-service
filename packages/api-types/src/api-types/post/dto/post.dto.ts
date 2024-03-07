export interface PostDto {
    id : number;
    title: string;
    content: string;
    category: string;
    writerId: number;
    clicks: number;
    cover: string | null;
    seriesId : number;
    releasedAt: Date | null;
}