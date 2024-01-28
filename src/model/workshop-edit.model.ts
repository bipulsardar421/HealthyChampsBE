import { WorkshopCredInterface, WorkshopInfoInterface, WorkshopVideoInterface } from "../interface";
import { WorkshopImageInterface } from "../interface/workshop/workshop-image.interface";

export class WorkshopEditModel {
    title: string = '';
    start_date: Date = new Date();
    end_date: Date = new Date();
    start_time: number = 0;
    end_time: number= 0;
    duration: number = 0;
    organiser: string = '';
    mode: string = '';
    session_type: string = '';
    session_cost: number = 0;
    credentials: WorkshopCredInterface[] = [];
    workshop_images: WorkshopImageInterface[] = [];
    workshop_videos: WorkshopVideoInterface[] = [];

    public static create(workshopInfo?: WorkshopInfoInterface): WorkshopEditModel {
        return new WorkshopEditModel(workshopInfo)
    }

    constructor(workshopInfo?: WorkshopInfoInterface) {
        if (workshopInfo) {
            this._intFormObj(workshopInfo);
        }
    }

    protected _intFormObj(workshopInfo?: WorkshopInfoInterface) {
        console.log(workshopInfo);
        Object.assign(this, workshopInfo);
    }
}