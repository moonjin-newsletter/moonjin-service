export function GenerateNextPaginationUrl(take: number, cursor : number, skip=1){
    return `take=${take}&skip=${skip}&cursor=${cursor}`
}