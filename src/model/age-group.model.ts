import { AgeGroupInterface } from "../interface";

export class AgeGroupModel {
    age_group_id: number = 0;
    age_group: string = ''
   
    constructor(ageGroup: AgeGroupInterface) {
        Object.assign(this, ageGroup)
    }
}