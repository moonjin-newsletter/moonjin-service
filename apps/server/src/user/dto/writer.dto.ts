import {ReaderDto} from "./reader.dto";
import {WriterInfo} from "@prisma/client";
import {WriterInfoDto} from "./writerInfo.dto";
import {UserDto} from "./user.dto";

export class WriterDto extends UserDto{
    writerInfo : WriterInfoDto;
    constructor(readerData: ReaderDto, writerInfo: WriterInfo) {
        super(readerData.id, readerData.email, readerData.nickname, readerData.role);
        this.writerInfo = writerInfo;
    }
}