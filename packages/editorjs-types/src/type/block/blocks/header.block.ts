import {TextBlock} from "../base/text.block";

export interface HeaderBlock extends TextBlock {
    type : "header";
    data: {
        text: string;
        level: number;
    }
}