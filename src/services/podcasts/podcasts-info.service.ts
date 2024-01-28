import { Op, Sequelize } from "sequelize";
import model, { Model } from "sequelize/types/model";
import { FilterBodyInterface, PodcastsDesInterface, PodcastsInfoInterface, RequestBodyInterface, RequestPodEpiInterface, RequestPodcastsDesInterface } from "../../interface";
import { decrypted, PostgresqlHelper, sequelize } from "../../helper";
import { CollectionResultModel } from "../../model";
import AppLogger from "../../helper/app-logger";
import { PodcastsEditDBModel } from "../../db-models/podcasts/podcasts-edit-db.model";
import { PodcastsInfoDBModel, PodcastsDesDBModel, PodcastsVideoDBModel, PodcastsEpisodeDBModel, PodcastsEpisodeAudioDBModel, PodcastsEpisodeTextDBModel } from "../../db-models";
import { PodcastsImageDBModel } from "../../db-models";
import { id } from "date-fns/locale";
import { NotificationService } from "..";
export class PodcastsInfoService {
  value: string;
  self = this;
  constructor() {
  }

 public async getPodcastsInfo(requestBody: Partial<RequestBodyInterface>): Promise<any> {
   try {
      const searchColumn = {
        'podcast_title': 'podcast_title',
        'time_duration': 'time_duration',
        'no_of_episodes': 'no_of_episodes',
        };
      const sortColunm = {
        'podcast_title': 'podcast_title',
        'time_duration': 'time_duration',
        'no_of_episodes': 'no_of_episodes',
        'subscription_type': 'subscription_type'
      };
      const postresSqlHelper = new PostgresqlHelper();
      const getQueryData = postresSqlHelper.tableListQuery(
        searchColumn,
        requestBody,
        PodcastsInfoDBModel,
        sortColunm
      );
      getQueryData.include = [{ model: PodcastsImageDBModel }];
  
      return await PodcastsInfoDBModel.findAndCountAll(getQueryData)
        .then((data) => {
          return new CollectionResultModel(data, requestBody);
        })
        .catch((err) => {
          return err;
        });
    } catch (err) {
      console.log(err);
      return err;
    }
  }
  

  public async addPodcastsInfo(podcasts: PodcastsInfoInterface): Promise<any> {
    const b =  await PodcastsInfoDBModel.create({
      podcast_title: podcasts.podcast_title,
      time_duration: podcasts.time_duration,
      no_of_episodes: podcasts.no_of_episodes,
      subscription_type: podcasts.subscription_type,
    });
    
    (new NotificationService()).sendNotification({ id: b.dataValues.podcasts_info_id, contentName: b.dataValues.podcast_title, moduleName: 'podacast', route: 'PodcastList' })
    return b

  }

 
public async getEpisodeInfo(episodeId: string): Promise<any> {
  const id = parseInt(decrypted(episodeId));
  return await PodcastsInfoDBModel.findAll({
    include: [
      {
        model: PodcastsDesDBModel,
        where: {
          status: "active",
        },
      },
      {
        model: PodcastsEpisodeDBModel,
        include: [
          {
            model: PodcastsEpisodeTextDBModel,
          },
          {
            model: PodcastsEpisodeAudioDBModel,
          },
        ],
        where: {
          status: "active",
        },
      },
    ],
    where: {
      podcasts_info_id: id,
    },
  });
}


  public async deletePodcastsInfo(requestBody: any): Promise<any> {
    const podcastsAry = requestBody.map(ids => parseInt(decrypted(ids)))
    return await PodcastsInfoDBModel.findAll({
      where: { podcasts_info_id: podcastsAry }
    }).then((ingredient) => {
      ingredient.forEach(val => {
        val.status = 'inactive';
        val.save()
      })
      return 'Podcasts is deleted successfully.'
    }).catch(err => {
      return 'Podcasts is not Deleted.!'
    });

  }


  public async getPodcastsDes(
    requestBody: Partial<RequestBodyInterface>
  ): Promise<any> {
    const searchColumn = [
      "podcasts_des",
    ];
    const postresSqlHelper = new PostgresqlHelper();
    const getQueryData = postresSqlHelper.tableListQuery(
      searchColumn,
      requestBody,
      PodcastsDesDBModel)

    return await PodcastsDesDBModel.findAndCountAll(
      getQueryData
    )

      .then((data) => {
        return new CollectionResultModel(data, requestBody);
      })
      .catch((err) => {
        return err;
      });
  }

  public async addPodcastsDes(podcasts: RequestPodcastsDesInterface): Promise<any> {
    const { podcasts_info_id, podcastsdes } = podcasts;
    const podcastDes = await PodcastsDesDBModel.findOne({
      where: { podcasts_info_id: podcasts_info_id }
    });
  
    if (podcastDes) {
      return await PodcastsDesDBModel.update({
        podcasts_des: podcasts.podcastsdes.podcasts_des
      },
      { where: { podcasts_info_id: podcasts_info_id } });
    } else {
      return await PodcastsDesDBModel.create({
        podcasts_des: podcasts.podcastsdes.podcasts_des,
        podcasts_info_id: podcasts_info_id
      });
    }
  }

  public async deletePodcastsDes(requestBody: any): Promise<any> {
    const podcastsAry = requestBody.map(ids => parseInt(decrypted(ids)))
    return await PodcastsDesDBModel.findAll({
      where: { podcasts_des_id: podcastsAry }
    }).then((ingredient) => {
      ingredient.forEach(val => {
        val.status = 'inactive';
        val.save()
      })
      return 'Podcasts is deleted successfully.'
    }).catch(err => {
      return 'Podcasts is not Deleted.!'
    });

  }



  public async getAllPodcastsInfo(): Promise<any> {
    return await PodcastsInfoDBModel.findAll();
  }
  public async getFiltePodcasts(resquestBody: FilterBodyInterface): Promise<any> {
    if (resquestBody && resquestBody.sno) {
      resquestBody.sno = resquestBody.sno
    }
    return await PodcastsInfoDBModel.findAll({
      where: resquestBody
    });
  }
  public async addEpisodes(episodes: any[]): Promise<void> {
    try {
      for (const episode of episodes) {
        const { episodeName, formArray, podcasts_info_id } = episode;
        const createdEpisode = await PodcastsEpisodeDBModel.create({
          podcasts_info_id,
          episodeName,
        });
        const episodeId = decrypted(createdEpisode.episode_id);
        const audioEntries = formArray.map((form) => ({
          episode_id: episodeId,
          upload: form.upload,
        }));
        const textEntries = formArray.map((form) => ({
          episode_id: episodeId,
          editor: form.editor,
        }));
        await PodcastsEpisodeAudioDBModel.bulkCreate(audioEntries);
        await PodcastsEpisodeTextDBModel.bulkCreate(textEntries);
      }
    } catch (error) {
      throw error;
    }
  }


  public async uploadImages(imageName: string,
    imageType: string,
    podcastsIds: number,
    typeQuery: string,
    imageId: number): Promise<any> {
    const imageTypes = {
      iconImg: 'icon_image',
      thumbnailImg: 'thumbnail_image',
      bannerImg: 'banner_image',
      podcastsMainImg: 'podcasts_main_image'
    }
    const payLoad = {};
    payLoad['podcasts_info_id'] = podcastsIds;
    payLoad[imageTypes[imageType]] = imageName
    if (typeQuery === 'create') {
      return await PodcastsImageDBModel.create(payLoad);
    } else {
      return await PodcastsImageDBModel.update(payLoad, {
        where: {
          podcasts_image_id: imageId
        }
      })
    }

  }

  public async updateImages(PodcastsInfoId: number, newImageData: any): Promise<void> {
    try {
      const existingImageData = await PodcastsImageDBModel.findOne({
        where: { podcasts_info_id: PodcastsInfoId },
      });

      if (!existingImageData) {
        throw new Error('Podcasts image data not found.');
      }
      const updatedData: any = {};
      if (newImageData.thumbnailImg) {
        updatedData.thumbnail_image = newImageData.thumbnailImg;
      } else {
        updatedData.thumbnail_image = existingImageData.getDataValue('thumbnail_image');
      }
      if (newImageData.iconImg) {
        updatedData.icon_image = newImageData.iconImg;
      } else {
        updatedData.icon_image = existingImageData.getDataValue('icon_image');
      }
      if (newImageData.podcastsMainImg) {
        updatedData.podcasts_main_image = newImageData.podcastsMainImg;
      } else {
        updatedData.podcasts_main_image = existingImageData.getDataValue('podcasts_main_image');
      }
      if (newImageData.bannerImg) {
        updatedData.banner_image = newImageData.bannerImg;
      } else {
        updatedData.banner_image = existingImageData.getDataValue('banner_image');
      }
      await PodcastsImageDBModel.update(updatedData, {
        where: { podcasts_info_id: PodcastsInfoId },
      });
    } catch (error) {
      throw new Error('Error updating images: ' + error.message);
    }
  }


  public async uploadVideos(videoName: string, podcastsIds: number, typeQuery: string, videoId: number): Promise<any> {
    console.log("Hello")
    const payLoad = {
      podcasts_info_id: podcastsIds,
      video: videoName,
    };
    if (typeQuery === 'create') {
      console.log("this")
      return await PodcastsVideoDBModel.create(payLoad);
    } else {
      console.log("update")
      return await PodcastsVideoDBModel.update(payLoad, {
        where: {
          podcasts_video_id: videoId
        }
      })

    }
  }

  public async updatePodcastsInfo(requestBody: any): Promise<any> {
    const podcasts_info_id = parseInt(decrypted(requestBody.podcasts_info_id));
    const t = await sequelize.getSequelize.transaction();
    try {
      const result = await Promise.all([
        PodcastsInfoDBModel.update({
          podcasts_info_id: requestBody.podcasts_info_id,
          podcast_title: requestBody.podcast_title,
          time_duration: requestBody.time_duration,
          no_of_episodes: requestBody.no_of_episodes,
          subscription_type: requestBody.subscription_type,

        }, {
          where: {
            podcasts_info_id: podcasts_info_id
          },
          transaction: t
        })
      ])
      await t.commit();
      return result

    } catch (error) {
      await t.rollback();
      return error;
    }

  }

  public async editPodcastsInfo(id: string): Promise<any> {
    return await PodcastsInfoDBModel.findOne({
       where: {
        podcasts_info_id: decrypted(id),
      },
    });
  }
  public async editPodcastsDes(id): Promise<any> {
    return await PodcastsDesDBModel.findOne({
      where: {
        podcasts_info_id: decrypted(id),
      },
    });

  }


  public async updatePodcastsDes(requestBody: any): Promise<any> {
    console.log('updated ', requestBody);
    const podcasts_des_id = parseInt(decrypted(requestBody.podcasts_info_id));

    const des = await PodcastsDesDBModel.findOne({
      where: { podcasts_info_id: podcasts_des_id }
    })
    if (des) {
      return await PodcastsDesDBModel.update({
        podcasts_des: requestBody.podcasts_des
      },
        { where: { podcasts_info_id: podcasts_des_id } })
    } else {
      return await PodcastsDesDBModel.create({
        podcasts_des: requestBody.podcasts_des,
        podcasts_info_id: podcasts_des_id
      })
    }
  }
  public async updatePodcastsEpiInfo(requestBody: any): Promise<any> {
    const podcasts_epi_id = parseInt(decrypted(requestBody.podcasts_epi_id));

    const des = await PodcastsEpisodeDBModel.findOne({
      where: { podcasts_info_id: podcasts_epi_id }
    })
    if (des) {
      return await PodcastsEpisodeDBModel.update({
        podcasts_epi: requestBody.podcasts_epi
      },
        { where: { podcasts_info_id: podcasts_epi_id } })
    } else {
      return await PodcastsEpisodeDBModel.create({
        podcasts_epi: requestBody.podcasts_epi,
        podcasts_info_id: podcasts_epi_id
      })
    }
  }
   

  public async editAllPodcasts(id): Promise<any> {
    return await PodcastsEditDBModel.findAll({
      include: [
        { model: PodcastsDesDBModel },
        { model: PodcastsEpisodeDBModel,
          include:[
            {
              model: PodcastsEpisodeAudioDBModel,
            },
            {
              model: PodcastsEpisodeTextDBModel,
            },
          ] 
        },
        { model: PodcastsImageDBModel },
        { model: PodcastsVideoDBModel },
      ], where: {
        podcasts_info_id: parseInt(decrypted(id)),
      },
    });
  }

  public async viewAllPodcastsInfo(id?: string): Promise<any> {
    console.log(id, parseInt(decrypted(id)))
    return await PodcastsEditDBModel.findOne({
      include: [
        { model: PodcastsDesDBModel },
        {
          model: PodcastsEpisodeDBModel,
          include: [
            PodcastsEpisodeAudioDBModel,
            PodcastsEpisodeTextDBModel,
          ],
        },
        { model: PodcastsImageDBModel },
        { model: PodcastsVideoDBModel },
      ],
      where: {
        podcasts_info_id: parseInt(decrypted(id)),
      },
    });

  }

  public async getAllPodcasts(limit?: any): Promise<PodcastsInfoDBModel[]> {
    try {
      const podcasts = await PodcastsInfoDBModel.findAll({
        include: [
          {
            model: PodcastsDesDBModel,
          },
          {
            model: PodcastsEpisodeDBModel,
          },
          {
            model: PodcastsImageDBModel,
          },
          {
            model: PodcastsVideoDBModel,
          },
        ],
        where: {
          status: 'active'
        },
        limit: limit,
        order: [
          ['updatedAt', 'DESC']
        ]
      });
      return podcasts;
    } catch (error) {
      throw new Error(`Unable to fetch podcasts: ${error.message}`);
    }
  }


}


