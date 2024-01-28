import { Column, Table, Model, AllowNull, ForeignKey, NotEmpty, PrimaryKey, AutoIncrement } from "sequelize-typescript";
import { PodcastTextInterface } from "../../interface";
import { decrypted, encrypted } from "../../helper";
import { PodcastsEpisodeDBModel } from "../podcasts/podcast-episode-db.model";

@Table({
    tableName: 'podcast_episode_text',
    timestamps: true
})
export class PodcastsEpisodeTextDBModel extends Model implements PodcastTextInterface {
    @PrimaryKey
    @AutoIncrement
    @Column
    set episode_text_id(value: string) {
        let val = '';
        if (value) {
            val = decrypted(this.getDataValue(value));
        } else {
            val = this.getDataValue(value);
        }
        this.setDataValue("episode_text_id", val);
    }
    get episode_text_id(): any {
        let en = '';
        if (this.getDataValue("episode_text_id")) {
            en = encrypted(this.getDataValue("episode_text_id"));
        } else {
            en = this.getDataValue("episode_text_id")
        }
        return en;
    }
    
    @AllowNull(true)
    @NotEmpty
    @ForeignKey(() => PodcastsEpisodeDBModel)
    @Column
    episode_id: number;

    @AllowNull(true)
    @NotEmpty
    @Column
    editor: string;
}