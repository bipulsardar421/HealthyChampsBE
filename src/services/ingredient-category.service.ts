import { PostgresqlHelper } from "../helper";
import { IngredientCategoryDBModel } from "../db-models/ingredient-category-db.model";
import {
  FilterBodyInterface,
  IngredientCategoryInterface,
  RequestBodyInterface,
} from "../interface";
import { CollectionResultModel } from "../model";
// import {createWordDocument} from "../utils/word-document";

interface RequestIngredientCategory {
  ingredient_category: string;
}

export class IngredientCategoryService {
  constructor() { }

  public async getIngredientCategoryList(
    requestBody: Partial<RequestBodyInterface>
  ): Promise<CollectionResultModel<IngredientCategoryInterface>> {
    const searchColumn = {'ingredient_category':'ingredient_category' };
    const sortColunm={'ingredient_category':'ingredient_category',
        }
    const postresSqlHelper = new PostgresqlHelper();
    return await IngredientCategoryDBModel.findAndCountAll(
      postresSqlHelper.tableListQuery(
        searchColumn,
        requestBody,
        IngredientCategoryDBModel,
        sortColunm
      )
    ).then((ingredientCategoryList) => {
      return new CollectionResultModel<IngredientCategoryInterface>(
        ingredientCategoryList,
        requestBody
      );
    });
  }

  public async addIngredentCategory(requestBody:RequestIngredientCategory): Promise<any> {
    return await IngredientCategoryDBModel.create({
      ingredient_category: requestBody.ingredient_category,
    });
  }

  public async deleteIngredientCat(requestBody: any): Promise<any> {
    return await IngredientCategoryDBModel.update({
      status: 'inactive'
    }, {
      where: { ingredient_category_id: requestBody }
    });
  }
  public async updateIngredientCat(requestBody: any): Promise<any> {
    return await IngredientCategoryDBModel.update({
      ingredient_category: requestBody.ingredient_category,
      status: 'active'
    }, {
      where: { ingredient_category_id: requestBody.ingredient_category_id }
    });
  }

  public async getIngredientCat(): Promise<any> {
    return await IngredientCategoryDBModel.findAll({
      where: { status: 'active' }
    });
  }
  public async getAllIngredientCategory(): Promise<any> {
    return await IngredientCategoryDBModel.findAll({
      attributes: ['ingredient_category_id', 'ingredient_category'],
      where:{
          status:'active'
      }
  });
}
}

