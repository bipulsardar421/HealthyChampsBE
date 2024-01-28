import { PostgresqlHelper } from "../helper";
import { MealTypeDBModel } from "../db-models/meal-type-db.model";
import {
  FilterBodyInterface,
  MealTypeInterface,
  RequestBodyInterface,
} from "../interface";
import { CollectionResultModel } from "../model";

interface RequestMealType {
  meal_type: string;
}

export class MealTypeService {
  constructor() {}

  public async getMealTypeList(
    requestBody: Partial<RequestBodyInterface>
  ): Promise<CollectionResultModel<MealTypeInterface>> {
    const searchColumn = {'meal_type':'meal_type'};
    const sortColunm={'meal_type':'meal_type',
  }
    const postresSqlHelper = new PostgresqlHelper();
    return await MealTypeDBModel.findAndCountAll(
      postresSqlHelper.tableListQuery(
        searchColumn,
        requestBody,
        MealTypeDBModel,
        sortColunm
      )
    ).then((mealTypeList) => {
        return new CollectionResultModel<MealTypeInterface>(
          mealTypeList,
          requestBody
        );
      });
    }

  public async addMealType(requestBody: RequestMealType
  ): Promise<any> {
    return await MealTypeDBModel.create({
      meal_type: requestBody.meal_type,
    });
  }

  public async deleteMealType(requestBody: any): Promise<any> {
       return await MealTypeDBModel.update({
        status: 'inactive'
    },{
        where: {meal_type_id: requestBody}
    });
}
public async updateMealType(requestBody: any): Promise<any> {
    return await MealTypeDBModel.update({
      meal_type: requestBody.meal_type,
        status: 'active'
    },{
       where: {meal_type_id: requestBody.meal_type_id}
    });
}
    public async getMealType(): Promise<any>{
        return await MealTypeDBModel.findAll({
          where: {status: 'active'}
        });
    }
    
    public async getAllMealType(): Promise<any> {
      return await MealTypeDBModel.findAll({
        attributes: ['meal_type_id', 'meal_type'],
        where:{
            status:'active'
        }
    });
  }
}

