import { SubscriptionDBModel } from "../db-models";
import { Op } from "sequelize";
import model, { Model } from "sequelize/types/model";
import { RequestBodyInterface, RequestWorkshopCredentialsInterface, RequestSubscriptionInterface, WorkshopCredentialsInterface, SubscriptionInterface } from "../interface";
import { decrypted, PostgresqlHelper } from "../helper";
import { CollectionResultModel } from "../model";
import AppLogger from "../helper/app-logger";

interface RequestWorkshopCredentials{
  
}

export class SubscriptionService {
  value: string;
  self = this;

  constructor() {
  }

  public async getSubscription( requestBody: Partial<RequestBodyInterface>): Promise<any> {
    const searchColumn = {
      "periodicity":"periodicity",
      "cost":"cost",
    };
    const sortColunm={
      "periodicity":"periodicity",
      "cost":"cost",
  };
    const postresSqlHelper = new PostgresqlHelper();

    const getQueryData = postresSqlHelper.tableListQuery(
      searchColumn,
      requestBody,
      SubscriptionDBModel,
      sortColunm)
      
  return await SubscriptionDBModel.findAndCountAll(
    getQueryData
  )

  .then((data) => {
    return new CollectionResultModel(data, requestBody);
  })
  .catch((err) => {
    return err;
  });
}

  public async editSubscription(id): Promise<any> {
    return await SubscriptionDBModel.findOne({
      where: {
        subscription_id: decrypted(id),
      },
    });
  }

  public async addSubscription(subscription: RequestSubscriptionInterface): Promise<any> {
    return await SubscriptionDBModel.create({
      periodicity: subscription.periodicity,
      cost: subscription.cost,

    });
}
public async deleteSubscription(requestBody: any): Promise<any> {
  const snoAry = requestBody.map(ids => parseInt(decrypted(ids)))
  return await SubscriptionDBModel.findAll({
    where: { subscription_id: snoAry }
  }).then((Subscription) => {
    Subscription.forEach(val => {
      val.status = 'inactive';
      val.save()
    })
    return 'Subscription is deleted successfully.'
  }).catch(err => {
    return 'Subscription is not Delete.!'
  });

}
// public async deleteSubscription(requestBody: any): Promise<any> {
//     return await SubscriptionDBModel.update({
//         status: 'inactive'
//     },{
//         where: {subscription_id: requestBody}
//     });
// }
public async updateSubscription(requestBody: any): Promise<any> {
  const subscription_id = parseInt(decrypted(requestBody.subscription_id)); 
  return await SubscriptionDBModel.findOne({
    where:{ subscription_id:subscription_id}
  }).then(subscriptionList=>{
    subscriptionList.periodicity= requestBody.periodicity,
        subscriptionList.cost= requestBody.cost,
        subscriptionList. status= 'active'
        subscriptionList.save();
        return 'subscription is Updated successfully.'
      }).catch(error => {
        return 'subscriptionList Updated failed.!'
      });
}

public async getSubscriptionAll(): Promise<any>{
    return await SubscriptionDBModel.findAll({
      attributes: ['subscription_id', 'periodicity', 'cost'],
      where: {status: 'active'}
    });
}

public async getAllSubscription(): Promise<any> {
  return await SubscriptionDBModel.findAll({
      attributes: ['subscription_id', 'periodicity', 'cost'],
      where:{
          status:'active'
      }
  });
}
}
