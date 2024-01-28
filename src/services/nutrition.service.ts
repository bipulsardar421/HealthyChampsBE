import { FilterBodyInterface, RequestBodyInterface, RequestNutritionInterface } from "../interface";
import { CollectionResultModel } from "../model";
import { NutritionDBModel } from "../db-models/nutrition-db.model";
import { decrypted, PostgresqlHelper, sequelize, SequelizeConfig } from "../helper";
import AppLogger from "../helper/app-logger";
import { IngredientDBModel } from "../db-models";
import { Sequelize } from "sequelize-typescript";

export class NutritionService {
  value: string;
  self = this;
  constructor() {
     }

  public async getNutrition(
    requestBody: Partial<RequestBodyInterface>
  ): Promise<any> {
    const searchColumn = {'ingredient_name':'name',
    'energy':'energy',
    'protein':'protein',
    'total_fat':'total_fat',
    'sugar':'sugar',
     'iron':'iron',
   'sodium':'sodium',
   'potassium':'potassium'
 };
    const postresSqlHelper = new PostgresqlHelper();
    const sortColunm={'ingredient_name':'name',
                       'energy':'energy',
                       'protein':'protein',
                       'total_fat':'total_fat',
                       'sugar':'sugar',
                        'iron':'iron',
                      'sodium':'sodium',
                      'potassium':'potassium'
                    }
    const getQueryData =  postresSqlHelper.tableListQuery(
      searchColumn,
      requestBody,
      NutritionDBModel,
      sortColunm
    )
     getQueryData.include = [{
      model: IngredientDBModel
    },
  ]
    return await NutritionDBModel.findAndCountAll(
      getQueryData
    )
      .then((data) => {
       return new CollectionResultModel(data, requestBody);
      })
      .catch((err) => {
        return err;
      });
  }

  public async editNutrition(id): Promise<any> {
    return await NutritionDBModel.findOne({
      where: {
        nutrition_id: decrypted(id),
      },
    });
  }

  public async addNutrition(
    requestBody: RequestNutritionInterface
  ): Promise<any> {
    return await NutritionDBModel.create({ 
    ingredient_name: requestBody.ingredient_name,
    weight: requestBody.weight,
    energy: requestBody.energy,
    protein: requestBody.protein,
    total_fat:requestBody.total_fat,
    saturated_fat:requestBody.saturated_fat,
    trans_fat: requestBody.trans_fat,
    polysat_fat:requestBody.polysat_fat,
    monosat_fat: requestBody.monosat_fat,
    carb: requestBody.carb,
    sugar: requestBody.sugar,
    added_sugar:requestBody.added_sugar,
    free_sugar:requestBody.free_sugar,
    dietery_fibre:requestBody.dietery_fibre,
    thiamin:requestBody.thiamin,
    riboflarin:requestBody.riboflarin,
    niacin:requestBody.niacin,
    vitamin_c:requestBody.vitamin_c,
    vitamin_e:requestBody.vitamin_e,
    vitamin_b6:requestBody.vitamin_b6,
    vitamin_b12:requestBody.vitamin_b12,
    total_folate:requestBody.total_folate,
    total_vitamin_a:requestBody.total_vitamin_a,
    sodium:requestBody.sodium,
    potassium:requestBody.potassium,
    magnessium:requestBody.magnessium,
    calcium:requestBody.calcium,
    phosphorus:requestBody.phosphorus,
    iron: requestBody.iron,
    zinc:requestBody.zinc,
    selenium:requestBody.selenium,
    iodine:requestBody.iodine,
    omega3:requestBody.omega3,
    protien_foods:requestBody.protien_foods
    })
  }

  public async getAllNutrition(): Promise<any> {
      return await NutritionDBModel.findAll(
        {
          include:[
            {
            model: IngredientDBModel
            },
          ],
          where: {
            status: 'active'
          },
        }
      );
  }

  public async deleteNutrition(requestBody: any): Promise<any> {
    const nutritionAry = requestBody.map(ids => parseInt(decrypted(ids)))
    return await NutritionDBModel.findAll({
        where: {nutrition_id: nutritionAry}
    }).then((nutrition) => {
        nutrition.forEach(val => {
        val.status = 'inactive';
        val.save()
       })
       return 'Nutritional Value is deleted successfully.'
    }).catch(err => {
       return 'Nutritional Value is not Delete.!'
    });
   
  }

  public async viewNutrition(id?: string): Promise<any> {
    return await NutritionDBModel.findOne({
      include: [
        { 
          model: IngredientDBModel
        },
      ], where: {
        nutrition_id: parseInt(decrypted(id)),
      },
    });
  }

  public async updateNutrition(requestBody: any): Promise<any> {
    const nutrition_id = parseInt(decrypted(requestBody.nutrition_id));
    return await NutritionDBModel.findOne({
      where: {nutrition_id: nutrition_id}
    }).then(nutritionList => {
      nutritionList.ingredient_name= requestBody.ingredient_name,
      nutritionList.weight= requestBody.weight,
      nutritionList.energy= requestBody.energy,
      nutritionList.protein= requestBody.protein,
      nutritionList.total_fat=requestBody.total_fat,
      nutritionList.saturated_fat=requestBody.saturated_fat,
      nutritionList.trans_fat= requestBody.trans_fat,
      nutritionList.polysat_fat=requestBody.polysat_fat,
      nutritionList.monosat_fat= requestBody.monosat_fat,
      nutritionList.carb= requestBody.carb,
      nutritionList.sugar= requestBody.sugar,
      nutritionList.added_sugar=requestBody.added_sugar,
      nutritionList.free_sugar=requestBody.free_sugar,
      nutritionList.dietery_fibre=requestBody.dietery_fibre,
      nutritionList.thiamin=requestBody.thiamin,
      nutritionList.riboflarin=requestBody.riboflarin,
      nutritionList.niacin=requestBody.niacin,
      nutritionList.vitamin_c=requestBody.vitamin_c,
      nutritionList.vitamin_e=requestBody.vitamin_e,
      nutritionList.vitamin_b6=requestBody.vitamin_b6,
      nutritionList.vitamin_b12=requestBody.vitamin_b12,
      nutritionList.total_folate=requestBody.total_folate,
      nutritionList.total_vitamin_a=requestBody.total_vitamin_a,
      nutritionList.sodium=requestBody.sodium,
      nutritionList.potassium=requestBody.potassium,
      nutritionList.magnessium=requestBody.magnessium,
      nutritionList.calcium=requestBody.calcium,
      nutritionList.phosphorus=requestBody.phosphorus,
      nutritionList.iron= requestBody.iron,
      nutritionList.zinc=requestBody.zinc,
      nutritionList.selenium=requestBody.selenium,
      nutritionList.iodine=requestBody.iodine,
      nutritionList.omega3=requestBody.omega3,
      nutritionList.protien_foods=requestBody.protien_foods
      nutritionList.status = 'active';
      nutritionList.save();
      return 'Nutritional Value is Updated successfully.'
    }).catch(error => {
      return 'Nutritional Value Updated failed.!'
    });
  }

  
  public async getFilterNutrition(resquestBody: FilterBodyInterface): Promise<any> {
    if(resquestBody && resquestBody.nutrition_id) {
      resquestBody.nutrition_id = decrypted( resquestBody.nutrition_id)
    }
    return await NutritionDBModel.findAll({
      where: resquestBody
    });
  }

//   public async uploadCSV(): Promise<any>{
//     return await NutritionDBModel.findAll
// //     const csv = require('csv-parser');
// //     const fs = require('fs');
// //    export.uploadCSV = (file) => {
// //    return new Promise((resolve, reject) => {
// //     const results = [];
// //     fs.createReadStream(file.path)
// //       .pipe(this.uploadCSV())
// //       .on('data', (data) => results.push(data))
// //       .on('end', () => {
// //         fs.unlinkSync(file.path);
// //         resolve(results);
// //       })
// //       .on('error', (error) => reject(error));
// //   });
// // };
// }

}