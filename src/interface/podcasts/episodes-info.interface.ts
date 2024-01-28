export interface PodcastsEpisodeInterface { 
    podcasts_info_id: number;
    episode_id:number;
    episodeName: string;
  };

//   export interface RequestPodEpiInterface {
//     podcasts_info_id: number;
//     podcast_episode_info: PodcastsEpisodeInterface
//   }
export interface EpisodeInfo {
    episodeName: string;
    editor: string;
    upload: string;
  }
  
  export interface Payload {
    formArray: {
      [key: string]: EpisodeInfo[];
    };
    podcasts_info_id: number;
  }
  
  export interface RequestPodEpiInterface {
    podcasts_info_id: number;
    podcast_episode_info: EpisodeInfo;
  }

  export interface PodcastAudioInterface {
    episode_id:number;
    upload: string;
    episode_audio_id:number;
  }
  export interface PodcastTextInterface {
    episode_id:number;
    editor: string;
    episode_text_id:number;
  }