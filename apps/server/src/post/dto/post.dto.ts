import {CategoryEnum} from "../../common/category.enum";

export interface PostDto {
    id : number;
    title: string;
    category: CategoryEnum;
    writerId: number;
    preview: string;
    cover: string;
    seriesId : number;
    lastUpdatedAt: Date;
    createdAt: Date;
}