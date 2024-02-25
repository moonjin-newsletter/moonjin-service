export interface ICreatePost {
    title: string
    content: string
    category: string
    status: boolean
    subtitle?: string
    cover?: string
    seriesId? : number
}