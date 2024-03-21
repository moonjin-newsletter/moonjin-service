import {LetterDto} from "./letter.dto";
import {UserIdentityDto} from "../../user/dto";

export interface LetterWithReceiverDto extends LetterDto {
    receiver: UserIdentityDto
}