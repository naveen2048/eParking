export class Floater
{
    SlotNumber:number;
    Status:string;
    Id:string;
    Type : boolean;
}


export enum Status { Open,Closed,Reserved,Used,Cancelled,Transit }