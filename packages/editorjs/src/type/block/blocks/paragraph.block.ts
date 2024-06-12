import {TextBlock} from "../base/text.block";

export interface ParagraphBlock extends TextBlock {
    type : "paragraph";
    data: {
        text: string;
    }
}