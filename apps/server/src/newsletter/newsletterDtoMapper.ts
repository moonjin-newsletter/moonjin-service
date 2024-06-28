import {NewsletterDto, NewsletterSummaryDto} from "./dto";
import {Newsletter} from "@prisma/client";


class NewsletterDtoMapper {

    public static newsletterToNewsletterDto(newsletter : Newsletter): NewsletterDto{
        return newsletter;
    }

    public static newsletterToNewsletterSummaryDto(newsletter : Newsletter): NewsletterSummaryDto{
        return {
            id : newsletter.id,
            postId : newsletter.postId,
            sentAt : newsletter.sentAt,
        }
    }

}

export default NewsletterDtoMapper;