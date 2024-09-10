export interface PostDto {
    id : number;
    title: string;
    subtitle: string;
    category: string;
    writerId: number;
    preview: string;
    cover: string;
    seriesId : number;
    lastUpdatedAt: Date;
    createdAt: Date;
}