import { PostgresqlHelper } from "../helper";
import { FoodCategoryDBModel } from "../db-models/food-category-db.model";
import { FoodCategoryInterface, RequestBodyInterface } from "../interface";
import { CollectionResultModel } from "../model";

interface RequestFoodCategory {
  food_category: string;
}

export class FoodCategoryService {

    constructor() {}

    public async getFoodCategoryList(requestBody: Partial<RequestBodyInterface>): Promise<CollectionResultModel<FoodCategoryInterface>> {
        const searchColumn = {'food_category':'food_category',
    };
        const sortColunm={'food_category':'food_category',
        }
        const postresSqlHelper = new PostgresqlHelper();
        return await FoodCategoryDBModel.findAndCountAll(postresSqlHelper.tableListQuery(searchColumn, requestBody, FoodCategoryDBModel,sortColunm))
        .then((foodCategoryList) => {
             return new CollectionResultModel<FoodCategoryInterface>(foodCategoryList, requestBody);
        });
    }

    

    public async addFoodCategory(requestBody: RequestFoodCategory): Promise<any> {
        return await FoodCategoryDBModel.create({
            food_category: requestBody.food_category
        });
    }

    public async deleteFoodCat(requestBody: any): Promise<any> {
        return await FoodCategoryDBModel.update({
            status: 'inactive'
        },{
            where: {food_category_id: requestBody}
        });
    }
    public async updateFoodCat(requestBody: any): Promise<any> {
        return await FoodCategoryDBModel.update({
            food_category: requestBody.food_category,
            status: 'active'
        },{
           where: {food_category_id: requestBody.food_category_id}
        });
    }
    public async getFoodCat(): Promise<any>{
        return await FoodCategoryDBModel.findAll({
            where: {status: 'active'}
        });
    }

    public async getAllFoodCategories(): Promise<any> {
        return await FoodCategoryDBModel.findAll({
            attributes: ['food_category_id', 'food_category'],
            where:{
                status:'active'
            }
        });
    }
    
}