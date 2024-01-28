import { PostgresqlHelper } from "../helper";
import { HighlyNutritionalDBModel } from "../db-models/highly-nutritional-db.model";
import {
  FilterBodyInterface,
  HighlyNutritionalInterface,
  RequestBodyInterface,
} from "../interface";
import { CollectionResultModel } from "../model";

interface RequestHighlyNutritional {
 highly_nutritional: string;
}

export class HighlyNutritionalService {
  constructor() {}

  public async getHighlyNutritionList(
    requestBody: Partial<RequestBodyInterface>
  ): Promise<CollectionResultModel<HighlyNutritionalInterface>> {
    const searchColumn = {'highly_nutritional':'highly_nutritional'};
    const sortColunm={'highly_nutritional':'highly_nutritional',
        }
    const postresSqlHelper = new PostgresqlHelper();
    return await HighlyNutritionalDBModel.findAndCountAll(
      postresSqlHelper.tableListQuery(
        searchColumn,
        requestBody,
        HighlyNutritionalDBModel,
        sortColunm
      )
    ).then((highlyNutritionalList) => {
      return new CollectionResultModel<HighlyNutritionalInterface>(
        highlyNutritionalList,
        requestBody
      );
    });
  }

  public async addHighlyNutrition(
    requestBody: RequestHighlyNutritional
  ): Promise<any> {
    return await HighlyNutritionalDBModel.create({
      highly_nutritional: requestBody.highly_nutritional
    });
  }

  public async deleteHighlyNutrition(requestBody: any): Promise<any> {
    return await HighlyNutritionalDBModel.update({
        status: 'inactive'
    },{
        where: {highly_nutritional_id: requestBody}
    });
}
public async updateHighlyNutrition(requestBody: any): Promise<any> {
    return await HighlyNutritionalDBModel.update({
      highly_nutritional: requestBody.highly_nutritional,
        status: 'active'
    },{
       where: {highly_nutritional_id: requestBody.highly_nutritional_id}
    });
}
    public async getHighlyNutrition(): Promise<HighlyNutritionalInterface[]>{
        return await HighlyNutritionalDBModel.findAll({
          attributes: ['highly_nutritional_id', 'highly_nutritional'],
          where: {
            status: 'active'
          }
        });
    }
    public async getAllHighNutrition(): Promise<any> {
      return await HighlyNutritionalDBModel.findAll({
        attributes: ['highly_nutritional_id', 'highly_nutritional'],
        where:{
            status:'active'
        }
    });
}
}



