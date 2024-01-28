import { decrypted } from "../helper";
import { PodcastsImageInterface, PodcastsInfoInterface, PodcastsVideoInterface, RequestPodcastsInfoInterface } from "../interface";

export class PodcastsEditModel {
    podcasts_info_id: number = 0;
    podcast_title: string= '';
    time_duration:string='';
    no_of_episodes:number=0;
    status: string = 'active';
    user_id: number = 0;
    podcasts_images: PodcastsImageInterface[] = [];
    podcasts_videos: PodcastsVideoInterface[] = [];
    subscription_type:boolean=false;


    public static create(podcastsInfo?:PodcastsInfoInterface): PodcastsEditModel {
        return new PodcastsEditModel(podcastsInfo)
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