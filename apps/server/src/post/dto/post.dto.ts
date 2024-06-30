export interface PostDto {
    id : number;
    title: string;
    category: string;
    writerId: number;
    preview: string;
    cover: string;
    seriesId : number;
    lastUpdatedAt: Date;
    createdAt: Date;
}