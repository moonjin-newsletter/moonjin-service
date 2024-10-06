export interface ISearchNewsletter {
    category?: string;
    seriesOnly?: boolean;
    sort: 'recent' | 'popular' | 'popular-series';
}