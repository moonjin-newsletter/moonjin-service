import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {PaginationOptionsDto} from "../dto";

export enum PaginationDefault {
    TAKE_DEFAULT = 10,
    SKIP_DEFAULT = 0,
}

export const GetPagination = createParamDecorator(
    (_date:any,context: ExecutionContext) :PaginationOptionsDto=> {
    const request = context.switchToHttp().getRequest();
    const pageNo = Number(request.query?.pageNo) || 1;
    const cursor = Number(request.query?.cursor) || undefined;

    if(cursor)
        return {
            take : PaginationDefault.TAKE_DEFAULT,
            skip : 1,
            pageNo,
            cursor
        }
    else{
        return {
            take : PaginationDefault.TAKE_DEFAULT,
            pageNo,
            skip : (pageNo-1) * PaginationDefault.TAKE_DEFAULT
        }
    }
});
