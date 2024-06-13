export interface PostDto {
    id : number;
    title: string;
    category: string;
    writerId: number;
    preview: string;
    clicks: number;
    cover: string;
    seriesId : number;
    lastUpdatedAt: Date;
}