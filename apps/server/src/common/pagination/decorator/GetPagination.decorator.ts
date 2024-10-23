import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {PaginationOptionsDto} from "../dto";

export enum PaginationDefault {
    TAKE_DEFAULT = 10,
    SKIP_DEFAULT = 0,
    PAGE_START_DEFAULT = 0
}

export const GetPagination = createParamDecorator(
    (_date:any,context: ExecutionContext) :PaginationOptionsDto=> {
    const request = context.switchToHttp().getRequest();
    const pageNo = Number(request.query?.pageNo) || PaginationDefault.PAGE_START_DEFAULT;
    const cursor = Number(request.query?.cursor) || undefined;
    const take = Number(request.query?.take) || undefined;

    if(cursor)
        return {
            take : take ? take : PaginationDefault.TAKE_DEFAULT,
            skip : 1,
            pageNo,
            cursor
        }
    else{
        return {
            take : take ? take : PaginationDefault.TAKE_DEFAULT,
            pageNo,
            skip : (pageNo) * PaginationDefault.TAKE_DEFAULT
        }
    }
});
