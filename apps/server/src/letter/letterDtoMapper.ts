import {Letter} from "@prisma/client";
import {LetterWithUser} from "./prisma/letterWithUser.prisma";
import {LetterDto, LetterWithUserDto, UserLetterProfileDto} from "./dto";
import * as process from "process";

class LetterDtoMapperClass {

    letterToLetterDto(letter : Letter) : LetterDto  {
        const {deleted,senderId,receiverId,...letterData } = letter;
        return letterData;
    }

    letterWithUserToLetterWithUserDto(letter : LetterWithUser) : LetterWithUserDto  {
        const letterDto = this.letterToLetterDto(letter);
        const {sender,receiver} = this.letterWithUserToUserLetterProfileDto(letter);
        return {...letterDto, sender,receiver};
    }

    letterWithUserToUserLetterProfileDto(letter : LetterWithUser) : {sender: UserLetterProfileDto, receiver: UserLetterProfileDto}  {
        const sender : UserLetterProfileDto = {
            id : letter.sender.id,
            nickname : letter.sender.nickname,
            email : letter.sender.writerInfo ? (letter.sender.writerInfo.moonjinId + '@' + process.env.MAILGUN_DOMAIN) : letter.sender.email,
        }
        const receiver : UserLetterProfileDto = {
            id : letter.receiver.id,
            nickname : letter.receiver.nickname,
            email : letter.receiver.writerInfo ? (letter.receiver.writerInfo.moonjinId + '@' + process.env.MAILGUN_DOMAIN) : letter.receiver.email,
        }
        return {sender,receiver};
    }
}
const LetterDtoMapper = new LetterDtoMapperClass();
export default LetterDtoMapper;