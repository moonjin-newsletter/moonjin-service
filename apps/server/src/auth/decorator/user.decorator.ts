import {createParamDecorator, ExecutionContext, InternalServerErrorException} from "@nestjs/common";
import {UserDto} from "../dto/user.dto";


export const User = createParamDecorator((data : keyof UserDto | undefined, context: ExecutionContext)=> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserDto; // 가드가 선행 되어야함
    if(!user){
        throw new InternalServerErrorException("Request에 user가 없습니다. Guard가 선행되어야 합니다.")
    }
    if(data){
        return user[data];
    }
    return user;
});
