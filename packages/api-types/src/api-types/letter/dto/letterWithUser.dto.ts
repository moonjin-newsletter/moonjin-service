import {LetterDto} from "./letter.dto";
import {UserIdentityDto} from "../../user/dto";

export interface LetterWithUserDto extends LetterDto {
    sender: UserIdentityDto
    receiver: UserIdentityDto
}