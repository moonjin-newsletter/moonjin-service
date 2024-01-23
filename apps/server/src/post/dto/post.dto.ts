export interface PostDto {
    id : number;
    title: string;
    content: string;
    category: string;
    writerId: number;
    cover: string | null;
    seriesId : number;
    status: boolean;
    releasedAt: Date | null;
}