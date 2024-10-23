import { MetadataRoute } from "next";
import { ResponseForm, SitemapResponseDto } from "@moonjin/api-types";
import { nfetch } from "@lib/fetcher/noAuth";

async function getWriterList(): Promise<SitemapResponseDto[]> {
  const { data: writerList } =
    await nfetch<ResponseForm<SitemapResponseDto[]>>("writer/sitemap");
  return writerList;
}

async function getNewsletterList(): Promise<SitemapResponseDto[]> {
  const { data: newsletterList } =
    await nfetch<ResponseForm<SitemapResponseDto[]>>("newsletter/sitemap");
  return newsletterList;
}

async function getSeriesList(): Promise<SitemapResponseDto[]> {
  const { data: seriesList } =
    await nfetch<ResponseForm<SitemapResponseDto[]>>("series/sitemap");
  return seriesList;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const writerList = await getWriterList().then(
    (res) =>
      res.map((writer) => ({
        url: `https://www.moonjin.site/@${writer.moonjinId}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.5,
      })) as MetadataRoute.Sitemap,
  );

  const newsletterList = await getNewsletterList().then(
    (res) =>
      res.map((newsletter) => ({
        url: `https://www.moonjin.site/@${newsletter.moonjinId}/post/${newsletter.id}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.5,
      })) as MetadataRoute.Sitemap,
  );

  const seriesList = await getSeriesList().then(
    (res) =>
      res.map((series) => ({
        url: `https://www.moonjin.site/@${series.moonjinId}/series/${series.id}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.5,
      })) as MetadataRoute.Sitemap,
  );

  return [
    {
      url: "https://www.moonjin.site",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://www.moonjin.site/series",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://www.moonjin.site/newsletter",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://www.moonjin.site/auth/login",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: "https://www.moonjin.site/auth/signup",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...writerList,
    ...newsletterList,
    ...seriesList,
  ];
}
