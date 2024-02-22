import {Letter} from "@prisma/client";
import {LetterDto} from "./dto/letter.dto";

class LetterDtoMapperClass {

    letterToletterDto(letter : Letter) : LetterDto  {
        const {deleted,...letterData } = letter;
        return letterData;
    }
}
const LetterDtoMapper = new LetterDtoMapperClass();
export default LetterDtoMapper;