import {createParamDecorator, ExecutionContext, InternalServerErrorException} from "@nestjs/common";
import {UserAuthDto} from "../dto/userAuthDto";


export const User = createParamDecorator((data : keyof UserAuthDto | undefined, context: ExecutionContext)=> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserAuthDto; // 가드가 선행 되어야함
    if(!user){
        throw new InternalServerErrorException("Request에 user가 없습니다. Guard가 선행되어야 합니다.")
    }
    if(data){
        return user[data];
    }
    return user;
});
