import { decrypted } from "../helper";
import { PodcastsInfoInterface, RequestPodcastsInfoInterface } from "../interface";

export class PodcastsAddModel {
    podcasts_info_id: number = 0;
    podcast_title: string= '';
    time_duration:string='';
    no_of_episodes:number=0;
    status: string = 'active';
    user_id: number = 0;
    subscription_type:boolean=false;

    public static create(podcastsInfo?: RequestPodcastsInfoInterface): PodcastsAddModel {
        return new PodcastsAddModel(podcastsInfo)
    }

    constructor(podcastsInfo?: RequestPodcastsInfoInterface) {
        if (podcastsInfo) {
            this._intFormObj(podcastsInfo);
        }
    }

    protected _intFormObj(podcastsInfo?: RequestPodcastsInfoInterface) {
        Object.assign(this, podcastsInfo);
       
    }
}