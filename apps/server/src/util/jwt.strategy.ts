import {PassportStrategy} from "@nestjs/passport";
import {Injectable} from "@nestjs/common";
import {ExtractJwt, Strategy} from "passport-jwt";

@Injectable()
export class JwtGaurdFromCookie extends PassportStrategy(
    Strategy,
    'jwt-cookie'
) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                request => {
                    return request?.cookies?.email_verification_token;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        return payload;
    }
}