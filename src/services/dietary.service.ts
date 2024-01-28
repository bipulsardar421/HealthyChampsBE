
import { PostgresqlHelper, decrypted } from "../helper";
import {DietaryDBModel} from "../db-models/dietary-db.model";
import { DietaryInterface, RequestBodyInterface } from "../interface";
import { CollectionResultModel } from "../model";
import { MealDietaryDBModel, RecipeDietaryDBModel, RecipeInfoDBModel } from "../db-models";
import { Op, Sequelize } from "sequelize";

interface RequestDietary {
    dietary: string,
    abbreviation: string,
    glossary: string
}

export class DietaryService {

    constructor() {}

    public async getDietaryList(requestBody: Partial<RequestBodyInterface>): Promise<CollectionResultModel<DietaryInterface>> {
        const searchColumn = {'dietary':'dietary',
        'abbreviation':'abbreviation'
        };
        const sortColunm={'dietary':'dietary',
                          'abbreviation':'abbreviation'
        }
        const postresSqlHelper = new PostgresqlHelper();
        return await DietaryDBModel.findAndCountAll(postresSqlHelper.tableListQuery(searchColumn, requestBody, DietaryDBModel,sortColunm))
        .then((dietaryList) => {
             return new CollectionResultModel<DietaryInterface>(dietaryList, requestBody);
             
        });
    }

    public async addDietary(requestBody: RequestDietary): Promise<any> {
        return await DietaryDBModel.create({
            dietary: requestBody.dietary,
            abbreviation:requestBody.abbreviation,
            glossary: requestBody.glossary
        });
    }

    public async deleteDietary(requestBody: any): Promise<any> {
        return await DietaryDBModel.update({
            status: 'inactive'
        },{
            where: {dietary_id: requestBody}
        });
    }
    
    public async isDietaryUsed(dietaryId): Promise <any> {
        console.log(dietaryId)
      const result = await Promise.all([
        RecipeInfoDBModel.findOne(
            {where:
            {dietary_id: dietaryId}
        }),
        RecipeDietaryDBModel.findOne(
            { where:
            {recipe_dietary_id: dietaryId}
        }),
        MealDietaryDBModel.findOne(
        {where:
            {mealplan_dietary_id: dietaryId}
        }),
      ]);
      return result.some(res => res!== null);
    }


    public async updateDietary(requestBody: any): Promise<any> {
        console.log('swathi',requestBody)
        return await DietaryDBModel.update({
            dietary_id: requestBody.dietary_id,
            dietary: requestBody.dietary,
            abbreviation: requestBody.abbreviation,
            glossary: requestBody.glossary,
            status: 'active'
        },{
           where: {dietary_id: requestBody.dietary_id}
        });
    }
   

    public async getAllDietary(): Promise<DietaryInterface[]> {
        return await DietaryDBModel.findAll({
            attributes: ['dietary_id', 'dietary'],
            where: {
                status: 'active'
            }
        });
    }

    public async getAllDietaries(): Promise<any> {
        return await DietaryDBModel.findAll({
            attributes: ['dietary_id', 'dietary', 'abbreviation', 'glossary'],
            where:{
                status:'active'
            }
        });
    }

    public async uniqueValidation(requestBody: any): Promise<any> {
        return await DietaryDBModel.findOne({
          where: {
            $and: Sequelize.where(
              Sequelize.fn('lower', Sequelize.col('dietary')),
              Sequelize.fn('lower', requestBody.dietary)
            ),
            status: 'active',
            dietary_id: { [Op.ne]: requestBody.dietary_id }
          }
        })
      }

}
