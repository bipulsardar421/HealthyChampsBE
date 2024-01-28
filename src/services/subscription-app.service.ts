import { Op } from "sequelize";
import model, { Model } from "sequelize/types/model";
import { decrypted, PostgresqlHelper } from "../helper";
import { CollectionResultModel } from "../model";
import { SubscriptionAppDBModel } from "../db-models";
import { RequestBodyInterface, SubscriptionAppInterface } from "../interface";




export class subscriptionAppService {
  value: string;
  self = this;
  constructor() {
  }


  public async getSubscriptionApp(
    requestBody: Partial<RequestBodyInterface>
  ): Promise<any> {
    const searchColumn = {  
      'user_name': 'user_name',
      'periodicity': 'periodicity',
      'from_date': 'from_date',
      'to_date': 'to_date',
      'cost':'cost'
    };
    const sortColumn = {  
    'user_name': 'user_name',
    'periodicity': 'periodicity',
    'from_date': 'from_date',
    'to_date': 'to_date',
    'cost':'cost'
  };
    const postresSqlHelper = new PostgresqlHelper();
    const getQueryData = postresSqlHelper.tableListQuery(
      searchColumn,
      requestBody,
      SubscriptionAppDBModel,
      sortColumn)
     
  return await SubscriptionAppDBModel.findAndCountAll(
    getQueryData
  )


  .then((data) => {
    return new CollectionResultModel(data, requestBody);
  })
  .catch((err) => {
    return err;
  });
}
public async getSubscribedUser(parentId: any): Promise<any>{
  const uid = decrypted(parentId.id)
  return await SubscriptionAppDBModel.findAll({
    where:{
      parent_id: uid
    }
  })
}


  public async addSubscriptionApp(sub: SubscriptionAppInterface): Promise<any> {
    return await SubscriptionAppDBModel.create({
        user_name: sub.user_name,
        periodicity: sub.periodicity,
        from_date: sub.from_date,
        to_date: sub.to_date,
        cost:sub.cost,
    });
}

public async deleteSubscriptionApp(requestBody: any): Promise<any> {
    const courseAry = requestBody.map(ids => parseInt(decrypted(ids)))
    return await SubscriptionAppDBModel.findAll({
      where: { subscription_app_id: courseAry }
    }).then((des) => {
        des.forEach(val => {
        val.status = 'inactive';
        val.save()
      })
      return 'Subscription is deleted successfully.'
    }).catch(err => {
      return 'Subscription is not Deleted.!'
    });
   }

   public async getAllSubscriptionApp(): Promise<any> {
    return await SubscriptionAppDBModel.findAll({
        attributes: ['subscription_app_id', 'user_name', 'periodicity', 'from_date', 'to_date', 'cost'],
        where:{
            status:'active'
        }
    });
}
  
}
  
