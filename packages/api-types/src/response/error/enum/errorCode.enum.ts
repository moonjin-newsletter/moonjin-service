
export enum ErrorCodeEnum {
    // auth/signup
    EMAIL_ALREADY_EXIST = '0001',
    NICKNAME_ALREADY_EXIST = "0002",
    MOONJIN_EMAIL_ALREADY_EXIST = "0003",
    SIGNUP_ERROR = "0004",
    WRITER_SIGNUP_ERROR = "0005",
    SIGNUP_ROLE_ERROR = "0006",
    // mail/mail
    EMAIL_NOT_EXIST = '0010',
    // auth/jwtToken
    TOKEN_NOT_FOUND = '0020',
    INVALID_TOKEN = '0021',
    // auth/login
    USER_NOT_FOUND = '0030',
    INVALID_PASSWORD = '0031',
    LOGIN_ERROR = "0032",
    EMAIL_NOT_VERIFIED = "0033",
    INVALID_SOCIAL = "0034",
    USER_NOT_FOUND_IN_SOCIAL = "0035",
    SOCIAL_PROFILE_NOT_FOUND = "0036",
    SOCIAL_LOGIN_ERROR = "0037",
    SOCIAL_USER_ERROR = "0038",
    SOCIAL_SIGNUP_TOKEN_NOT_FOUND = "0039",
    // social
    SOCIAL_SIGNUP_ERROR = "0040",
    // auth
    PASSWORD_CHANGE_ERROR = "0050",
    USER_NOT_WRITER = "0051",
    // oauth
    OAUTH_NOT_FOUND = "0060",
    
    // post
    CREATE_POST_ERROR = "0100",
    POST_NOT_FOUND = "0101",
    FORBIDDEN_FOR_POST = "0102",
    POST_CONTENT_NOT_FOUND = "0103",
    /// stamp
    STAMP_ALREADY_EXIST= "0110",
    /// newsletter
    SEND_NEWSLETTER_ERROR = "0120",
    NEWSLETTER_CATEGORY_NOT_FOUND = "0121",
    NEWSLETTER_NOT_FOUND = "0122",
    NEWSLETTER_ALREADY_EXIST = "0123",

    // series
    CREATE_SERIES_ERROR = "0201",
    SERIES_NOT_FOUND = "0202",
    FORBIDDEN_FOR_SERIES = "0203",
    SERIES_NOT_EMPTY = "0204",

    // user
    /// subscribe
    SUBSCRIBE_MYSELF_ERROR = "0400",
    SUBSCRIBE_ALREADY_ERROR = "0401",
    SUBSCRIBER_NOT_FOUND = "0402",
    SUBSCRIBER_ALREADY_EXIST = "0403",
    //user
    PROFILE_CHANGE_ERROR = "0410",

    // letter
    SEND_LETTER_ERROR = "0500",
    FORBIDDEN_FOR_LETTER = "0501",
    LETTER_NOT_FOUND = "0502",
    LETTER_ALREADY_READ = "0503",

    // like
    LIKE_NOT_FOUND = "0600",
    LIKE_ALREADY_EXIST = "0601",


    //File
    FILE_EXTENTION_ERROR = "1000",
    FILE_UPLOAD_ERROR = "1001",

    // dev
    EMPTY_LIST_INPUT = "9000",
    EMPTY_VALUE_INPUT = "9001",
}