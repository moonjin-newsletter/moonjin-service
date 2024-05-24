import {NewsletterDto} from "./dto";
import {NewsletterWithPostAndSeriesAndWriterUser} from "./prisma/newsletterWithPost.prisma.type";
import PostDtoMapper from "../post/postDtoMapper";
import SeriesDtoMapper from "../series/seriesDtoMapper";
import UserDtoMapper from "../user/userDtoMapper";


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
}

export default NewsletterDtoMapper;