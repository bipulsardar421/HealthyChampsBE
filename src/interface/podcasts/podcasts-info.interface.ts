export type PodcastsInfoInterface = {
    podcasts_info_id: number;
    podcast_title: string;
    time_duration:string;
    no_of_episodes:number;
    subscription_type:boolean;
   
 
  };
    
  export interface RequestPodcastsInfoInterface{
    podcast_title: string;
    time_duration:string;
    no_of_episodes:number;
    subscription_type:boolean;
    
  }; 
     