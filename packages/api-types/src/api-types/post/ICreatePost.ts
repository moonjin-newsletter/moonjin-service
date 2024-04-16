export interface ICreatePost {
    title: string;
    content: any;
    category?: string;
    status?: boolean;
    subtitle?: string;
    cover?: string;
    seriesId? : number;
}