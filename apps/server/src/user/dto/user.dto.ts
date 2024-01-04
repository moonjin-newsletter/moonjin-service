export class UserDto {
    id: number;
    email: string;
    nickname: string;
    role: number;

    constructor(id:number, email:string, nickname: string, role: number) {
        this.id = id;
        this.email = email;
        this.nickname = nickname;
        this.role = role;
    }
}