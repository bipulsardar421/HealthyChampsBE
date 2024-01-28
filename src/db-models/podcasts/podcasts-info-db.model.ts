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

import { PodcastsInfoInterface } from "src/interface/podcasts/podcasts-info.interface";
import { decrypted, encrypted } from "../../helper";
import { PodcastsDesDBModel } from "./description-db.model";
import { PodcastsImageDBModel } from "./podcasts-image.db.model";
import { PodcastsVideoDBModel } from "./podcasts-video-db.model";
import { PodcastsEpisodeDBModel } from "./podcast-episode-db.model";

@Table({
  tableName: "podcasts_info",
  timestamps: true,
})
export class PodcastsInfoDBModel extends Model implements PodcastsInfoInterface {

  @PrimaryKey
  @AutoIncrement
  @Column
  set podcasts_info_id(value: string) {
    let val: string | number = '';
    if (value) {
      val = decrypted(this.getDataValue(value));
    } else {
      val = decrypted(this.getDataValue(value));
    }
    this.setDataValue("podcasts_info_id", val);
  }
  get podcasts_info_id(): any {
    let en = '';
    if (this.getDataValue("podcasts_info_id")) {
      en = encrypted(this.getDataValue("podcasts_info_id"));
    } else {
      en = this.getDataValue("podcasts_info_id")
    }

    return en;
  }
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
  no_of_episodes: number;

  @AllowNull(false)
  @NotEmpty
  @Column
  subscription_type: boolean;

  @AllowNull(true)
  @Default('active')
  @Column
  status: string;

  @HasMany(() => PodcastsDesDBModel, 'podcasts_info_id')
  podcasts_des: PodcastsDesDBModel[]

  @HasMany(() => PodcastsImageDBModel, 'podcasts_info_id')
  podcasts_images: PodcastsImageDBModel[]

  @HasMany(() => PodcastsEpisodeDBModel, 'podcasts_info_id')
  podcasts_episodes: PodcastsEpisodeDBModel[]

  @HasMany(() => PodcastsVideoDBModel, 'podcasts_info_id')
  podcasts_videos: PodcastsVideoDBModel[]

  @BeforeValidate
  static validation(action: PodcastsInfoDBModel, options: any) {
    console.log(action)
  }
}


