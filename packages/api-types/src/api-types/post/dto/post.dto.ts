export interface PostDto {
    id : number;
    title: string;
    content: string;
    category: string;
    writerId: number;
    clicks: number;
    cover: string | null;
    seriesId : number;
    lastUpdatedAt: Date;
}