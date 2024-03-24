import {OauthDto} from "./dto";
import {Oauth} from "@prisma/client";

class OauthDtoMapperClass {
    OauthToOauthDto(oauth : Oauth) : OauthDto {
        return oauth;
    }
}
const OauthDtoMapper = new OauthDtoMapperClass();
export default OauthDtoMapper;