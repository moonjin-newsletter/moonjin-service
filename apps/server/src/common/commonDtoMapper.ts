import {IPaginationQuery} from "./api-types/IPaginationQuery";
import {PaginationOptionsDto} from "./dto/paginationOptionsDto";

class CommonDtoMapperClass {
    IPaginationQueryToPaginationOptionsDto(query: IPaginationQuery): PaginationOptionsDto {
        if(query.cursor){
            return {
                skip: 1,
                take: query.take?? 10,
                cursor: query.cursor
            }
        }
        return {
            skip: query.skip?? 0,
            take: query.take?? 10
        }
    }

    generateNextPaginationUrl(take: number, cursor : number, skip=1){
        return `take=${take}&skip=${skip}&cursor=${cursor}`
    }
    generatePreviousPaginationUrl(take: number, cursor : number, skip=1){
        return `take=${-1 * take}&skip=${skip}&cursor=${cursor}`
    }
}


const CommonDtoMapper = new CommonDtoMapperClass();
export default CommonDtoMapper;