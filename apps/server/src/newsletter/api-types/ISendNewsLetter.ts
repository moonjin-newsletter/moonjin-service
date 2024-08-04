import {tags} from "typia";

export interface ISendNewsLetter{
    newsletterTitle : string & tags.MaxLength<128> & tags.MinLength<1>;
}