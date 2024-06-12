import {TextBlock} from "../base/text.block";

export interface QuoteBlock extends TextBlock{
    type : "quote",
    data : {
        text : string,
        caption : string,
        alignment : "left" | "center"
    }
}
