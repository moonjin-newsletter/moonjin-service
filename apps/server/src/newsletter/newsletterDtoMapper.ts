import {NewsletterAllDataDto, NewsletterDto, NewsletterSummaryDto} from "./dto";
import {Newsletter} from "@prisma/client";
import {NewsletterWithPostAndContentAndWriter} from "./prisma/newsletterWithPostAndContentAndWriter.prisma.type";
import PostDtoMapper from "../post/postDtoMapper";
import SeriesDtoMapper from "../series/seriesDtoMapper";
import {WriterInfoDtoMapper} from "../writerInfo/writerInfoDtoMapper";


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

    public static NewsletterWithPostAndContentAndWriterToNewsletterAllDataDto(newsletterWithPostAndContentAndWriter : NewsletterWithPostAndContentAndWriter):NewsletterAllDataDto{
        const {postContent,post, ...newsletterData} = newsletterWithPostAndContentAndWriter
        const {series, writerInfo, ...postData} = post
        return {
            newsletter: this.newsletterToNewsletterDto(newsletterData),
            post : PostDtoMapper.PostToPostDto(postData),
            postContent : PostDtoMapper.PostContentToPostContentDto(postContent),
            series : series ? SeriesDtoMapper.SeriesToSeriesDto(series) : null,
            writer : WriterInfoDtoMapper.WriterInfoWithUserToWriterInfoInCardDto(writerInfo)
        }
    }
}

export default NewsletterDtoMapper;