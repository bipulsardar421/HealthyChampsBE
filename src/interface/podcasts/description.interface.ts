export interface PodcastsDesInterface { 
    podcasts_info_id: number;
    podcasts_des_id:number;
    podcasts_des: string;

  };
  export interface PodDesInterface{
    podcasts_des: string;
  };
  export interface RequestPodcastsDesInterface{
    podcasts_info_id: number;
    podcasts_des_id:number;
    podcastsdes:PodDesInterface;
  }