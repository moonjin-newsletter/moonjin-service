import { NewsletterSummaryDto} from "./dto";
import {Newsletter} from "@prisma/client";


class NewsletterDtoMapper {

    public static newsletterToNewsletterSummaryDto(newsletter : Newsletter): NewsletterSummaryDto{
        return {
            id : newsletter.id,
            sentAt : newsletter.sentAt,
        }
    }
}

export default NewsletterDtoMapper;