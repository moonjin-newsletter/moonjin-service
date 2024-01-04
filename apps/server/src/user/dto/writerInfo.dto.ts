export class WriterInfoDto {
    id: number;
    moonjinEmail: string;
    userId : number;

    constructor(id: number, moonjinEmail: string, userId: number) {
        this.id = id;
        this.moonjinEmail = moonjinEmail;
        this.userId = userId;
    }
}