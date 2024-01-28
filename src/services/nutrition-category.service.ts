import { PostgresqlHelper } from "../helper";
import { NutritionCategoryDBModel } from "../db-models/nutrition-category-db.model";
import {
  FilterBodyInterface,
  RequestBodyInterface,
} from "../interface";
import { NutritionCategoryInterface } from "../interface/nutrition-category.interface";
import { CollectionResultModel } from "../model";

interface RequestNutritionCategory {
  nutrition_category: string;
}

export class NutritionCategoryService {
  constructor() {}

  public async getNutritionCategoryList(
    requestBody: Partial<RequestBodyInterface>
  ): Promise<CollectionResultModel<NutritionCategoryInterface>> {
    const searchColumn = {'nutrition_category':'nutrition_category',
  };
    const sortColunm={'nutrition_category':'nutrition_category',
  }
    const postresSqlHelper = new PostgresqlHelper();
    return await NutritionCategoryDBModel.findAndCountAll(
      postresSqlHelper.tableListQuery(
        searchColumn,
        requestBody,
        NutritionCategoryDBModel,
        sortColunm
      )
    ).then((nutritionCategoryList) => {
      return new CollectionResultModel<NutritionCategoryInterface>(
        nutritionCategoryList,
        requestBody
      );
    });
  }

  public async addNutritionCategory(
    requestBody: RequestNutritionCategory
  ): Promise<any> {
    return await NutritionCategoryDBModel.create({
      nutrition_category: requestBody.nutrition_category,
    });
  }

  public async deleteNutritionCat(requestBody: any): Promise<any> {
    return await NutritionCategoryDBModel.update({
        status: 'inactive'
    },{
        where: {nutrition_category_id: requestBody}
    });
}
public async updateNutritionCat(requestBody: any): Promise<any> {
    return await NutritionCategoryDBModel.update({
      nutrition_category: requestBody.nutrition_category,
        status: 'active'
    },{
       where: {nutrition_category_id: requestBody.nutrition_category_id}
    });
}
    
    public async getNutritionCat(): Promise<any>{
        return await NutritionCategoryDBModel.findAll({
          where: {status: 'active'}
        });
    }
    public async getAllNutritionCat(): Promise<any> {
      return await NutritionCategoryDBModel.findAll({
        attributes: ['nutrition_category_id', 'nutrition_category'],
        where:{
            status:'active'
        }
    });
  }
}

