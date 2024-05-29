import process from "process";
import {CookieOptions} from "express";

const httpsCookieOption : CookieOptions = process.env.VERSION === 'prod' ? {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    domain: process.env.DOT_MOONJIN_DOMAIN
}: {}

export default httpsCookieOption;