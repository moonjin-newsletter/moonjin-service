import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {PaginationOptionsDto} from "../dto";

export enum PaginationDefault {
    TAKE_DEFAULT = 10,
    SKIP_DEFAULT = 0,
}

export const GetPagination = createParamDecorator(
    (_date:any,context: ExecutionContext):PaginationOptionsDto=> {
    const request = context.switchToHttp().getRequest();
    const take = Number(request.query?.take) || PaginationDefault.TAKE_DEFAULT;
    const skip = Number(request.query?.skip) || PaginationDefault.SKIP_DEFAULT;
    const cursor = Number(request.query?.cursor) || undefined;

    if(cursor)
        return {
            take,
            skip : 1,
            cursor
        }
    else{
        return {
            take,
            skip
        }
    }
});
