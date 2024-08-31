import {HeaderBlock} from "./blocks/header.block";
import {ParagraphBlock} from "./blocks/paragraph.block";
import {CheckListBlock} from "./blocks/checkList.block";
import {EmbedBlock} from "./blocks/embed.block";
import {ImageBlock} from "./blocks/image.block";
import {LinkEmbedBlock} from "./blocks/linkEmbed.block";
import {ListBlock} from "./blocks/list.block";
import {QuoteBlock} from "./blocks/quote.block";
import {DelimiterBlock} from "./blocks/delimiter.block";

export type EditorBlockDto =
    CheckListBlock | EmbedBlock | HeaderBlock | ImageBlock |
    LinkEmbedBlock | ListBlock | ParagraphBlock | QuoteBlock |
    DelimiterBlock;