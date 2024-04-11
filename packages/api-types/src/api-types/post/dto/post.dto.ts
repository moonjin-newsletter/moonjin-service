export interface PostDto {
    id : number;
    title: string;
    category: string;
    writerId: number;
    clicks: number;
    cover: string | null;
    seriesId : number;
    lastUpdatedAt: Date;
}