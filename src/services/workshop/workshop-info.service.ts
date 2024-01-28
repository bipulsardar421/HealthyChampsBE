
import { ChildAllergenDBModel, ChildDietaryDBModel, ChildPreferenceDBModel, WorkshopDescriptionDBModel, WorkshopEditDBModel, WorkshopInfoDBModel, WorkshopVideoDBModel } from "../../db-models";
import { Op } from "sequelize";
import model, { Model } from "sequelize/types/model";
import { ChildInfoInterface, RequestBodyInterface, RequestWorkshopCredentialsInterface, RequestWorkshopDesInterface, RequestWorkshopInfoInterface } from "../../interface";
import { decrypted, PostgresqlHelper, sequelize } from "../../helper";
import { CollectionResultModel } from "../../model";
import AppLogger from "../../helper/app-logger";
import { WorkshopCredentialsDBModel } from "../../db-models/workshop/workshop-credentials-db.model";
import { WorkshopImageDBModel } from "../../db-models/workshop/workshop-image-db.model";
import { NotificationService } from "..";


interface RequestWorkshopCredentials {

}
export class WorkshopInfoService {
  value: string;
  self = this;
  constructor() {
  }

  public async getWorkshopInfo(
    requestBody: Partial<RequestBodyInterface>
  ): Promise<any> {
    const searchColumn = {
      'title': 'title',
      'start_date': 'start_date',
      'end_date': 'end_date',
      'start_time': 'start_time',
      'end_time': 'end_time',
      'duration': 'duration',
      'organiser': 'organiser',
      'mode': 'mode',
      'session_type': 'session_type',
      'session_cost': 'session_cost'
    };
    const sortColunm = {
      'title': 'title',
      'start_date': 'start_date',
      'end_date': 'end_date',
      'start_time': 'start_time',
      'end_time': 'end_time',
      'duration': 'duration',
      'organiser': 'organiser',
      'mode': 'mode',
      'session_type': 'session_type',
      'session_cost': 'session_cost'
    }
    const postresSqlHelper = new PostgresqlHelper();
    const getQueryData = postresSqlHelper.tableListQuery(
      searchColumn,
      requestBody,
      WorkshopInfoDBModel,
      sortColunm)

    return await WorkshopInfoDBModel.findAndCountAll(
      getQueryData
    )


      .then((data) => {
        return new CollectionResultModel(data, requestBody);
      })
      .catch((err) => {
        return err;
      });
  }


  public async editWorkshopInfo(id): Promise<any> {
    return await WorkshopInfoDBModel.findOne({
      where: {
        workshop_info_id: decrypted(id),
      },
    });
  }
  public async viewAllWorkshopInfo(id?: string): Promise<any> {
    return await WorkshopEditDBModel.findOne({
      include: [
        { model: WorkshopCredentialsDBModel },
        { model: WorkshopDescriptionDBModel },
        { model: WorkshopImageDBModel },
        { model: WorkshopVideoDBModel },

      ], where: {
        workshop_info_id: parseInt(decrypted(id)),
      },
    });
  }

  public async addWorkshopInfo(workshop: RequestWorkshopInfoInterface): Promise<any> {
    const b =  await WorkshopInfoDBModel.create({
      title: workshop.title,
      start_date: workshop.start_date,
      end_date: workshop.end_date,
      start_time: workshop.start_time,
      end_time: workshop.end_time,
      duration: workshop.duration,
      organiser: workshop.organiser,
      mode: workshop.mode,
      session_type: workshop.session_type,
      session_cost: workshop.session_cost,
    });
    (new NotificationService()).sendNotification({ id: b.dataValues.workshop_info_id, contentName: b.dataValues.title, moduleName: 'workshop', route: 'WorkshopList' })
    return b

  }

  public async deleteWorkshopInfo(requestBody: any): Promise<any> {
    const workshopAry = requestBody.map(ids => parseInt(decrypted(ids)))
    return await WorkshopInfoDBModel.findAll({
      where: { workshop_info_id: workshopAry }
    }).then((workshop) => {
      workshop.forEach(val => {
        val.status = 'inactive';
        val.save()
      })
      return 'Workshop is deleted successfully.'
    }).catch(err => {
      return 'Workshop is not Deleted.!'
    });
  }

  public async updateWorkshopInfo(requestBody: any): Promise<any> {
    const workshop_info_id = parseInt(decrypted(requestBody.workshop_info_id));
    const t = await sequelize.getSequelize.transaction();
    try {
      const result = await Promise.all([
        WorkshopInfoDBModel.update({
          workshop_info_id: requestBody.workshop_info_id,
          title: requestBody.title,
          start_date: requestBody.start_date,
          end_date: requestBody.end_date,
          start_time: requestBody.start_time,
          end_time: requestBody.end_time,
          duration: requestBody.duration,
          organiser: requestBody.organiser,
          mode: requestBody.mode,
          session_type: requestBody.session_type,
          session_cost: requestBody.session_cost,
        }, {
          where: {
            workshop_info_id: workshop_info_id
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

  public async getWorkshopCredentials(
    requestBody: Partial<RequestBodyInterface>
  ): Promise<any> {
    const searchColumn = [
      "meeting_link",
      "meeting_id",
      "passcode",
      "location",
    ];
    const postresSqlHelper = new PostgresqlHelper();
    const getQueryData = postresSqlHelper.tableListQuery(
      searchColumn,
      requestBody,
      WorkshopCredentialsDBModel)

    return await WorkshopCredentialsDBModel.findAndCountAll(
      getQueryData
    )
      .then((data) => {
        return new CollectionResultModel(data, requestBody);
      })
      .catch((err) => {
        return err;
      });
  }


  public async editWorkshopCredentials(id): Promise<any> {
    return await WorkshopCredentialsDBModel.findOne({
      where: {
        workshop_credentials_id: decrypted(id),
      },
    });
  }


  public async addWorkshopCredentials(workshop: RequestWorkshopCredentialsInterface): Promise<any> {
    return await WorkshopCredentialsDBModel.create({
      workshop_info_id: workshop.workshop_info_id,
      meeting_link: workshop.cred.meeting_link,
      meeting_id: workshop.cred.meeting_id,
      passcode: workshop.cred.passcode,
      location: workshop.cred.location,


    });
  }


  public async deleteWorkshopCredentials(requestBody: any): Promise<any> {
    const workshopAry = requestBody.map(ids => parseInt(decrypted(ids)))
    return await WorkshopCredentialsDBModel.findAll({
      where: { workshop_credentials_id: workshopAry }
    }).then((workshop) => {
      workshop.forEach(val => {
        val.status = 'inactive';
        val.save()
      })
      return 'Workshop is deleted successfully.'
    }).catch(err => {
      return 'Workshop is not Deleted.!'
    });
  }

  public async updateWorkshopCredentials(requestBody: any): Promise<any> {
    const workshop_credentials_id = parseInt(decrypted(requestBody.workshop_info_id));
    const credentials = await WorkshopCredentialsDBModel.findOne({
      where: { workshop_info_id: workshop_credentials_id }
    })
    if (credentials) {
      return await WorkshopCredentialsDBModel.update({
        meeting_link: requestBody.meeting_link,
        meeting_id: requestBody.meeting_id,
        passcode: requestBody.passcode,
        location: requestBody.location,
      },
        { where: { workshop_info_id: workshop_credentials_id } })
    } else {
      return await WorkshopCredentialsDBModel.create({
        meeting_link: requestBody.meeting_link,
        meeting_id: requestBody.meeting_id,
        passcode: requestBody.passcode,
        location: requestBody.location,
        workshop_info_id: workshop_credentials_id
      })
    }
  }

  public async uploadImages(imageName: string,
    imageType: string,
    workshopIds: number,
    typeQuery: string,
    imageId: number): Promise<any> {
    const imageTypes = {
      iconImg: 'icon_image',
      thumbnailImg: 'thumbnail_image',
      bannerImg: 'banner_image',
      workshopMainImg: 'workshop_main_image'
    }
    const payLoad = {};
    payLoad['workshop_info_id'] = workshopIds;
    payLoad[imageTypes[imageType]] = imageName
    if (typeQuery === 'create') {
      return await WorkshopImageDBModel.create(payLoad);
    } else {
      return await WorkshopImageDBModel.update(payLoad, {
        where: {
          workshop_image_id: imageId
        }
      })
    }
  }

  public async uploadVideos(videoName: string, workshopIds: number, typeQuery: string, videoId: number): Promise<any> {
    const payLoad = {
      workshop_info_id: workshopIds,
      video: videoName,
    };
    if (typeQuery === 'create') {
      return await WorkshopVideoDBModel.create(payLoad);
    } else {
      return await WorkshopVideoDBModel.update(payLoad, {
        where: {
          workshop_video_id: videoId
        }
      })

    }
  }

  public async editAllWorkshops(id): Promise<any> {
    return await WorkshopEditDBModel.findAll({
      include: [
        { model: WorkshopCredentialsDBModel },
        { model: WorkshopDescriptionDBModel },
        { model: WorkshopImageDBModel },
        { model: WorkshopVideoDBModel },
      ], where: {
        workshop_info_id: parseInt(decrypted(id)),
      },
    });
  }

  public async getUpcomingWorkshops(): Promise<any> {
    try {
      const currentDate = new Date();
      const upcomingWorkshops = await WorkshopInfoDBModel.findAll({
        where: {
          start_date: {
            [Op.gt]: currentDate,
          },
        },
        order: [['start_date', 'ASC']],
        include: [WorkshopCredentialsDBModel],
        group: ['WorkshopInfoDBModel.workshop_info_id', 'workshop_credentials.workshop_credentials_id',],
      });
      return upcomingWorkshops;
    } catch (error) {
      throw error;
    }
  }
 
public async getWorkshopDes(
  requestBody: Partial<RequestBodyInterface>
): Promise<any> {
  const searchColumn = [
    "workshop_des",
  ];
  const postresSqlHelper = new PostgresqlHelper();
  const getQueryData = postresSqlHelper.tableListQuery(
    searchColumn,
    requestBody,
    WorkshopDescriptionDBModel)

  return await WorkshopDescriptionDBModel.findAndCountAll(
    getQueryData
  )
    .then((data) => {
      return new CollectionResultModel(data, requestBody);
    })
    .catch((err) => {
      return err;
    });
}

public async addWorkshopDes(workshop: RequestWorkshopDesInterface): Promise<any> {
  const workshop_info_id = workshop.workshop_info_id;
  const workshopDes = await WorkshopDescriptionDBModel.findOne({
    where: { workshop_info_id: workshop_info_id }
  });

  if (workshopDes) {
    return await WorkshopDescriptionDBModel.update({
      workshop_des: workshop.workshopdes.workshop_des
    },
    { where: { workshop_info_id: workshop_info_id } });
  } else {
    return await WorkshopDescriptionDBModel.create({
      workshop_des: workshop.workshopdes.workshop_des,
      workshop_info_id: workshop_info_id
    });
  }
}


public async deleteWorkshopDes(requestBody: any): Promise<any> {
  const workshopAry = requestBody.map(ids => parseInt(decrypted(ids)))
  return await WorkshopDescriptionDBModel.findAll({
    where: { workshop_des_id: workshopAry }
  }).then((work) => {
    work.forEach(val => {
      val.status = 'inactive';
      val.save()
    })
    return 'Workshop is deleted successfully.'
  }).catch(err => {
    return 'Workshop is not Deleted.!'
  });

}

public async updateWorkshopDes(requestBody: any): Promise<any> {
  const workshop_des_id = parseInt(decrypted(requestBody.workshop_info_id));

  const des = await WorkshopDescriptionDBModel.findOne({
    where: { workshop_info_id: workshop_des_id }
  })
  if (des) {
    return await WorkshopDescriptionDBModel.update({
      workshop_des: requestBody.workshop_des
    },
      { where: { workshop_info_id: workshop_des_id } })
  } else {
    return await WorkshopDescriptionDBModel.create({
      workshop_des: requestBody.workshop_des,
      workshop_info_id: workshop_des_id
    })
  }
}

public async editWorkshopDes(id): Promise<any> {
  return await WorkshopDescriptionDBModel.findOne({
    where: {
      workshop_info_id: decrypted(id),
    },
  });

}

public async updateImages(workshopInfoId: number, newImageData: any): Promise<void> {
  try {
    const existingImageData = await WorkshopImageDBModel.findOne({
      where: { workshop_info_id: workshopInfoId },
    });

    if (!existingImageData) {
      throw new Error('Workshop image data not found.');
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
    if (newImageData.workshopMainImg) {
      updatedData.workshop_main_image = newImageData.workshopMainImg;
    } else {
      updatedData.workshop_main_image = existingImageData.getDataValue('workshop_main_image');
    }
    if (newImageData.bannerImg) {
      updatedData.banner_image = newImageData.bannerImg;
    } else {
      updatedData.banner_image = existingImageData.getDataValue('banner_image');
    }
    await WorkshopImageDBModel.update(updatedData, {
      where: { workshop_info_id: workshopInfoId },
    });
  } catch (error) {
    throw new Error('Error updating images: ' + error.message);
  }
}



  public async getAllWorkshopInfo(): Promise<any> {
    return await WorkshopInfoDBModel.findAll();
  }
  public async getAllWorkshops(limit?: any): Promise<WorkshopInfoDBModel[]> {
    try {
      const workshops = await WorkshopInfoDBModel.findAll({
        include: [
          {
            model: WorkshopCredentialsDBModel,
          },
          {
            model: WorkshopDescriptionDBModel,
          },
          {
            model: WorkshopImageDBModel,
          },
          {
            model: WorkshopVideoDBModel,
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
      return workshops;
    } catch (error) {
      throw new Error(`Unable to fetch workshops: ${error.message}`);
    }
  }


  

  public async getRegisterWorkshop(workshop_info_id?: string): Promise<any> {
    try {
      return await WorkshopInfoDBModel.findOne({
        include: [WorkshopCredentialsDBModel],
        where: {
          workshop_info_id: parseInt(decrypted(workshop_info_id)),
          status: 'active'
        },
      });
    } catch (err) {
      console.error(err)
    }
  }
}






