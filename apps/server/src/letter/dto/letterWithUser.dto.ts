import {LetterDto} from "./letter.dto";
import {UserLetterProfileDto} from "./userLetterProfileDto";

export interface LetterWithUserDto extends LetterDto {
    sender: UserLetterProfileDto
    receiver: UserLetterProfileDto
}