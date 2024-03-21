import {Letter} from "@prisma/client";
import {LetterDto} from "./dto/letter.dto";
import {LetterWithSender} from "./prisma/letterWithSender.prisma";
import {LetterWithSenderDto} from "./dto/letterWithSender.dto";
import {LetterWithReceiver} from "./prisma/letterWithReceiver.prisma";
import {LetterWithReceiverDto} from "./dto";

class LetterDtoMapperClass {

    letterToletterDto(letter : Letter) : LetterDto  {
        const {deleted,senderId,receiverId,...letterData } = letter;
        return letterData;
    }

    letterWithSenderToLetterWithSenderDto(letter : LetterWithSender) : LetterWithSenderDto  {
        const letterDto = this.letterToletterDto(letter);
        return {...letterDto, sender: letter.sender};
    }
    letterWithReceiverToLetterWithReceiverDto(letter : LetterWithReceiver) : LetterWithReceiverDto  {
        const letterDto = this.letterToletterDto(letter);
        return {...letterDto, receiver: letter.receiver};
    }

}
const LetterDtoMapper = new LetterDtoMapperClass();
export default LetterDtoMapper;