import {NewsletterDto, NewsletterSummaryDto} from "./dto";
import {NewsletterWithPostAndSeriesAndWriterUser} from "./prisma/newsletterWithPost.prisma.type";
import PostDtoMapper from "../post/postDtoMapper";
import SeriesDtoMapper from "../series/seriesDtoMapper";
import UserDtoMapper from "../user/userDtoMapper";
import {Newsletter} from "@prisma/client";


class NewsletterDtoMapper {
    public static newsletterWithPSWUToNewsletterDto(newsletterWithPostAndSeriesAndWriterUser: NewsletterWithPostAndSeriesAndWriterUser): NewsletterDto {
        const {writerInfo, series,...postData } = newsletterWithPostAndSeriesAndWriterUser.newsletter.post;

        return {
            post : PostDtoMapper.PostToReleasedPostDto(postData),
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
}

export default NewsletterDtoMapper;