import {
    AfterCreate,
      AllowNull,
      AutoIncrement,
      BeforeValidate,
      Column,
      DataType,
      Default,
      ForeignKey,
      HasMany,
      Model,
      NotEmpty,
      PrimaryKey,
      Sequelize,
      Table, 
    } from "sequelize-typescript";

import { decrypted, encrypted } from "../../helper";
import { PodcastsEditInterface } from "../../interface/podcasts/podcasts-edit.interface";
import { PodcastsDesDBModel } from "./description-db.model";
import { PodcastsImageDBModel } from "./podcasts-image.db.model";
import { PodcastsVideoDBModel } from "./podcasts-video-db.model";
import { PodcastsEpisodeDBModel } from "./podcast-episode-db.model";

    
    @Table({
      tableName: "podcasts_info",
      timestamps: false,
    })
    export class PodcastsEditDBModel extends Model implements PodcastsEditInterface {
     
      @PrimaryKey 
      @AllowNull(true)
      @NotEmpty
      @Column
      podcasts_info_id: number; 
    
      @AllowNull(false)
      @NotEmpty
      @Column
      podcast_title: string;

 
      @AllowNull(false)
      @NotEmpty
      @Column
      time_duration: string;
  
      @AllowNull(false)
      @NotEmpty 
      @Column
      no_of_episodes:number;

      @AllowNull(false)
      @NotEmpty
      @Column
      subscription_type:boolean;
      
    @HasMany(() => PodcastsDesDBModel, 'podcasts_info_id')
    podcasts_des: PodcastsDesDBModel;

    @HasMany(() => PodcastsEpisodeDBModel, 'podcasts_info_id') 
    podcasts_episodes: PodcastsEpisodeDBModel;

    @HasMany(() => PodcastsImageDBModel, 'podcasts_info_id')
    podcasts_images: PodcastsImageDBModel;
  
    @HasMany(() => PodcastsVideoDBModel, 'podcasts_info_id')
    podcasts_videos: PodcastsVideoDBModel;
    
      @AllowNull(true)
      @Default('active')
      @Column
      status: string;
      
    
    }
    
  
  