import { AutoIncrement, Column, PrimaryKey, Table, Model, AllowNull, ForeignKey, NotEmpty, Default, AfterCreate, BeforeValidate, Sequelize, BelongsTo, HasMany } from "sequelize-typescript";
import { PodcastsDesInterface, PodcastsEpisodeInterface } from "../../interface";
import { decrypted, encrypted } from "../../helper";
import { PodcastsInfoDBModel } from "./podcasts-info-db.model";
import { PodcastsEpisodeTextDBModel } from "./episodes-info-db.model";
import { PodcastsEpisodeAudioDBModel } from "./episodes-audio-db.model";

@Table({
    tableName: 'podcast_episode',
    timestamps: true
})
export class PodcastsEpisodeDBModel extends Model implements PodcastsEpisodeInterface {
    @PrimaryKey
    @AutoIncrement
    @Column
    set episode_id(value: string) {
        let val = '';
        if (value) {
            val = decrypted(this.getDataValue(value));
        } else {
            val = this.getDataValue(value);
        }

        this.setDataValue("episode_id", val);
    }
    get episode_id(): any {
        let en = '';
        if (this.getDataValue("episode_id")) {
            en = encrypted(this.getDataValue("episode_id"));
        } else {
            en = this.getDataValue("episode_id")
        }
        return en;
    }
    @AllowNull(true)
    @NotEmpty
    @ForeignKey(() => PodcastsInfoDBModel)
    @Column
    podcasts_info_id: number;

    @BelongsTo(() => PodcastsInfoDBModel, 'podcasts_info_id')
    podcasts_info: PodcastsInfoDBModel[];

    @AllowNull(true)
    @NotEmpty
    @Column
    episodeName: string;

    @AllowNull(true)
    @Default('active')
    @Column
    status: string;

    @HasMany(() => PodcastsEpisodeTextDBModel, 'episode_id')
    editor: PodcastsEpisodeTextDBModel;

    @HasMany(() => PodcastsEpisodeAudioDBModel, 'episode_id')
    upload: PodcastsEpisodeAudioDBModel[];

}