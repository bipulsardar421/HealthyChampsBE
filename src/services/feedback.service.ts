import { FilterBodyInterface, RequestBodyInterface, FeedbackInterface, VerbiageInterface, RequestFeedbackInterface } from "../interface";
import { CollectionResultModel } from "../model";
import { FeedbackDBModel } from "../db-models/feedback_db.model";
import { decrypted, PostgresqlHelper, sequelize } from "../helper";
import { ParentInfoDBModel } from "../db-models/parent-info-db.model";
import { Op } from "sequelize";

export class FeedbackService {
  value: string;
  self = this;
  constructor() { }

  public async getFeedback(requestBody: Partial<RequestBodyInterface>): Promise<any> {
    try {
      const searchColumn = {
        "email_address": 'parent_id',
        "error_reported": "error_reported",
        "suggestions_given": "suggestions_given"
      };
      const sortColumn = {
        'email_address': 'parent_id',
        'error_reported': 'error_reported',
        'suggestions_given': 'suggestions_given',
      };
  
      const postresSqlHelper = new PostgresqlHelper();
      const getQueryData = postresSqlHelper.tableListQuery(
        searchColumn,
        requestBody,
        FeedbackDBModel,
        sortColumn
      );
      getQueryData.include = [{ model: ParentInfoDBModel }];
  
      return await FeedbackDBModel.findAndCountAll(getQueryData)
        .then((data) => {
          return new CollectionResultModel(data, requestBody);
        })
        .catch((err) => {
          return err;
        });
    } catch (err) {
      console.error(err);
      return err;
    }
  }
  // public async getVerbiage(requestBody: Partial<RequestBodyInterface>): Promise<CollectionResultModel<VerbiageInterface>> {
  //   const searchColumn = [
  //     'verbiage'
  //   ];
  //   const postresSqlHelper = new PostgresqlHelper();
  //   return await VerbiageDBModel.findAndCountAll(postresSqlHelper.tableListQuery(searchColumn, requestBody, VerbiageDBModel))
  //     .then((verbiageList) => {
  //       return new CollectionResultModel<VerbiageInterface>(verbiageList, requestBody);
  //     });
  // }

  public async addFeedback(requestBody: RequestFeedbackInterface): Promise<any> {
    const parentID = parseInt(decrypted(requestBody.parent_id))
    return await FeedbackDBModel.create({
      parent_id: parentID,
      error_reported: requestBody.error_reported,
      suggestions_given: requestBody.suggestions_given,
    });
  }

  // public async addVerbiage(requestBody: VerbiageInterface): Promise<any> {
  //   return await VerbiageDBModel.create({
  //     verbiage: requestBody.verbiage,
  //   });
  // }

  public async editFeedback(id): Promise<any> {
    return await FeedbackDBModel.findOne({
      where: {
        feedback_id: decrypted(id),
      },
    });
  }

  // public async editVerbiage(id): Promise<any> {
  //   return await VerbiageDBModel.findOne({
  //     where: {
  //       verbiage_id: id,
  //     },
  //   });
  // }

  public async viewFeedback(id?: string): Promise<any> {
    return await FeedbackDBModel.findOne({
      include: [
        { model: ParentInfoDBModel },

      ], where: {
        feedback_id: parseInt(decrypted(id)),
      },
    });
  }


  public async getFeedbackCount(): Promise<any> {
    try {
      const errorCount = await FeedbackDBModel.count({
        where: {
          error_reported: {
            [Op.not]: null,
          },
          status: 'active',
        },
      });

      const suggestionCount = await FeedbackDBModel.count({
        where: {
          suggestions_given: {
            [Op.not]: null,
          },
          status: 'active',
        },
      });

      return { errorCount, suggestionCount };
    } catch (error) {
      throw error;
    }
  }


  // public async viewVerbiage(id?: string): Promise<any> {
  //   return await VerbiageDBModel.findOne({
  //     include: [

  //     ], where: {
  //       verbiage_id: id,
  //     },
  //   });
  // }

  public async updateFeedback(requestBody: any): Promise<any> {
    const feedback_id = parseInt(decrypted(requestBody.feedback_id));
    return await FeedbackDBModel.findOne({
      where: { feedback_id: feedback_id }
    }).then(feedbackList => {
      feedbackList.parent_id = requestBody.parent_id,
        feedbackList.error_reported = requestBody.error_reported,
        feedbackList.suggestions_given = requestBody.suggestions_given,
        feedbackList.status = 'active';
      feedbackList.save();
      return 'Feedback Updated successfully.'
    }).catch(error => {
      return 'Feedback Updated failed.!'
    });
  }

  // public async updateVerbiage(requestBody: any): Promise<any> {
  //   const verbiage_id = requestBody.verbiage_id;
  //   return await VerbiageDBModel.findOne({
  //     where: { verbiage_id: verbiage_id }
  //   }).then(feedbackList => {
  //     feedbackList.verbiage = requestBody.verbiage,
  //       feedbackList.status = 'active';
  //     feedbackList.save();
  //     return 'Verbiage Updated successfully.'
  //   }).catch(error => {
  //     return 'Verbiage Updated failed.!'
  //   });
  // }


  public async deleteFeedback(requestBody: any): Promise<any> {
    const feedbackAry = requestBody.map(ids => parseInt(decrypted(ids)))
    return await FeedbackDBModel.findAll({
      where: { feedback_id: feedbackAry }
    }).then((feedback) => {
      feedback.forEach(val => {
        val.status = 'inactive';
        val.save()
      })
      return 'Feedback deleted successfully.'
    }).catch(err => {
      return 'Feedback is not Deleted.!'
    });

  }


  // public async deleteVerbiage(requestBody: any): Promise<any> {
  //   return await VerbiageDBModel.update({
  //     status: 'inactive'
  //   }, {
  //     where: { verbiage_id: requestBody }
  //   });
  // }


  public async getAllFeedback(): Promise<FeedbackInterface[]> {
    return await FeedbackDBModel.findAll(
      { 
        include : [{ 
          model: ParentInfoDBModel
         },
        ],
        where:{
          status: 'active'
        },
      }
    );
  }


  // public async getVerbiagedetail(id: number): Promise<any> {
  //   return await VerbiageDBModel.findOne({
  //     where: {
  //       verbiage_id: id
  //     }
  //   })
  // }
  // verbiage_id
  // public async getAllVerbiage(): Promise<VerbiageInterface[]> {
  //   const verbiage = await VerbiageDBModel.findAll({
  //     attributes: ['verbiage_id'],
  //     where: {
  //       status: 'active'
  //     }
  //   })
  //   this.verbiage_id = verbiage[0].verbiage_id
  //   const k = await this.getVerbiagedetail(this.verbiage_id)
  //   return k
  // }
}