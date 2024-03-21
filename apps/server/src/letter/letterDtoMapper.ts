import {Letter} from "@prisma/client";
import {LetterDto} from "./dto/letter.dto";
import {LetterWithUser} from "./prisma/letterWithUser.prisma";
import {LetterWithUserDto} from "./dto";

class LetterDtoMapperClass {

    letterToletterDto(letter : Letter) : LetterDto  {
        const {deleted,senderId,receiverId,...letterData } = letter;
        return letterData;
    }

    letterWithUserToletterWithUserDto(letter : LetterWithUser) : LetterWithUserDto  {
        const letterDto = this.letterToletterDto(letter);
        return {...letterDto, sender: letter.sender,receiver:letter.receiver};
    }


}
const LetterDtoMapper = new LetterDtoMapperClass();
export default LetterDtoMapper;