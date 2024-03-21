import {LetterDto} from "./letter.dto";
import {UserIdentityDto} from "../../user/dto";

export interface LetterWithSenderDto extends LetterDto {
    sender: UserIdentityDto
}