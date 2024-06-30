
export class Category {
    public static list = [
        "고민,사색",
        "여행",
        "취미,여가",
        "일상,경험",
        "문학,에세이",
        "경제,트렌드",
        "문학,예술",
        "IT,과학",
        "비즈니스",
        "기타"
    ]

    /**
     * @summary 카테고리 이름으로 카테고리 번호를 가져오기.
     * @param category
     */
    public static getNumberByCategory(category: string | undefined | null): number {
        if(!category) return -1;
        return this.list.indexOf(category);
    }

    /**
     * @summary 카테고리 번호로 카테고리 이름을 가져오기. (없으면 공백)
     * @param number
     */
    public static getCategoryByNumber(number: number): string {
        if(number < 0 || number >= this.list.length) return "";
        return this.list[number];
    }

    /**
     * @summary 카테고리가 유효한지 확인하기.
     * @param category
     */
    public static isValidCategory(category: string): boolean {
        return this.list.includes(category);
    }
}