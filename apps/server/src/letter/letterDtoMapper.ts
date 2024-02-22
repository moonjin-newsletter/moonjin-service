import {Letter} from "@prisma/client";
import {LetterDto} from "./dto/letter.dto";
import {LetterWithSender} from "./dto/letterWithUser.prisma";
import {LetterWithSenderDto} from "./dto/LetterWithSender.dto";

class LetterDtoMapperClass {

    letterToletterDto(letter : Letter) : LetterDto  {
        const {deleted,...letterData } = letter;
        return letterData;
    }

    letterWithSenderToLetterWithSenderDto(letter : LetterWithSender) : LetterWithSenderDto  {
        const {deleted,senderId,...letterData } = letter;
        return letterData;
    }


}
const LetterDtoMapper = new LetterDtoMapperClass();
export default LetterDtoMapper;