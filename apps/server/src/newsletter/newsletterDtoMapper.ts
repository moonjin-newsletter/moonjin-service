import {NewsletterDto, NewsletterSummaryDto, SendNewsletterResultDto} from "./dto";
import {NewsletterWithPostAndSeriesAndWriterUser} from "./prisma/newsletterWithPost.prisma.type";
import PostDtoMapper from "../post/postDtoMapper";
import SeriesDtoMapper from "../series/seriesDtoMapper";
import UserDtoMapper from "../user/userDtoMapper";
import {Newsletter} from "@prisma/client";
import {SentNewsletterWithCounts} from "./prisma/sentNewsletterWithCounts.prisma.type";


class NewsletterDtoMapper {
    public static newsletterWithPSWUToNewsletterDto(newsletterWithPostAndSeriesAndWriterUser: NewsletterWithPostAndSeriesAndWriterUser): NewsletterDto {
        const {post, ...newsletterData} = newsletterWithPostAndSeriesAndWriterUser.newsletter;
        const {writerInfo, series,...postData } = post;

        return {
            post : PostDtoMapper.PostToReleasedPostDto(postData, newsletterData.sentAt),
            series : series ? SeriesDtoMapper.SeriesToSeriesDto(series) : null,
            writer : UserDtoMapper.UserToUserProfileDto(writerInfo.user),
        };
    }

    public static newsletterToNewsletterSummaryDto(newsletter : Newsletter): NewsletterSummaryDto{
        return {
            id : newsletter.id,
            sentAt : newsletter.sentAt,
            title : newsletter.title,
            cover : newsletter.cover
        }
    }

    public static sentNewsletterWithCountsToSendNewsletterResultDto(newsletter : SentNewsletterWithCounts): SendNewsletterResultDto{
        return {
            ...this.newsletterToNewsletterSummaryDto(newsletter),
            deliveredCount : newsletter._count.newsletterAnalytics,
            totalSentCount : newsletter._count.newsletterInMail
        }
    }
}

export default NewsletterDtoMapper;