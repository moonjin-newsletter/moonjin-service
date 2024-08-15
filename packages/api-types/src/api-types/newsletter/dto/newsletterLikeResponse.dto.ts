export type NewsletterLikeResponseDto = NewsletterLikeStatusResponse | NewsletterNotLikeStatusResponse;

export interface NewsletterLikeStatusResponse {
    like : true;
    createdAt : Date;
}

export interface NewsletterNotLikeStatusResponse {
    like : false;
}