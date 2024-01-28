import { Column, Table, Model, AllowNull, ForeignKey, NotEmpty, Default, PrimaryKey, AutoIncrement, BelongsTo } from "sequelize-typescript";
import { PodcastAudioInterface } from "../../interface";
import { decrypted, encrypted } from "../../helper";
import { PodcastsEpisodeDBModel } from "./podcast-episode-db.model";
import { ConfigManager } from "../../config";

@Table({
    tableName: 'podcast_episode_audio',
    timestamps: true
})
export class PodcastsEpisodeAudioDBModel extends Model implements PodcastAudioInterface {

    @PrimaryKey
    @AutoIncrement
    @Column
    set episode_audio_id(value: string) {
        let val = '';
        if (value) {
            val = decrypted(this.getDataValue(value));
        } else {
            val = this.getDataValue(value);
        }

        this.setDataValue("episode_audio_id", val);
    }
    get episode_audio_id(): any {
        let en = '';
        if (this.getDataValue("episode_audio_id")) {
            en = encrypted(this.getDataValue("episode_audio_id"));
        } else {
            en = this.getDataValue("episode_audio_id")
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
    set upload(audio) {
        this.setDataValue('upload', audio)
    }
    get upload(): string {
        const config = new ConfigManager().config;
        return config.baseUrl+'/api-audio/podcasts/'+this.getDataValue("upload") 
    }

    @BelongsTo(() => PodcastsEpisodeDBModel, 'episode_id')
    episode: PodcastsEpisodeDBModel;

}