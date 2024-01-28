import { FilterBodyInterface, RequestBodyInterface, RequestChildInfoInterface, ChildInfoInterface } from "../interface";
import { ChildAddModel, ChildAllergenEditModel, ChildDietaryEditModel, ChildPreferenceEditModel, CollectionResultModel } from "../model";
import { AllergenDBModel, ChildAllergenDBModel, ChildDietaryDBModel, ChildEditDBModel, ChildInfoDBModel, ChildPreferenceDBModel, DietaryDBModel, NutritionCategoryDBModel } from "../db-models";
import { decrypted, PostgresqlHelper, sequelize } from "../helper";
import { Op } from "sequelize";
import model, { Model } from "sequelize/types/model";
import AppLogger from "../helper/app-logger";
import { ParentInfoDBModel } from "../db-models";

export class ChildInfoService {
  value: string;
  self = this;
  constructor() {
  }

  public async getChildInfo(
    requestBody: Partial<RequestBodyInterface>
  ): Promise<any> {
    const searchColumn = {
      'date_of_birth': 'date_of_birth',
      'child_name': 'child_name',
      // 'allergen': 'allergen',
      // 'dietary': 'dietary',
      // 'nutrition_category': 'nutrition_category',
    };
    const sortColunm = {
      'date_of_birth': 'date_of_birth',
      'child_name': 'child_name',
      // 'allergen': 'allergen',
      // 'dietary': 'dietary',
      // 'nutrition_category': 'nutrition_category',
    };

    const postresSqlHelper = new PostgresqlHelper();
    const getQueryData = postresSqlHelper.tableListQuery(
      searchColumn,
      requestBody,
      ChildInfoDBModel,
      sortColunm)
    if (requestBody.filterFields && requestBody.filterFields.parent_id) {
      getQueryData.where = { ...getQueryData.where, ...{ parent_id: decrypted(requestBody.filterFields.parent_id) } };

    }

    return await ChildInfoDBModel.findAndCountAll({
      ...getQueryData,
      include: [
        ChildDietaryDBModel,
        ChildAllergenDBModel,
        ChildPreferenceDBModel,
      ]
    })
      .then((data) => {
        return new CollectionResultModel(data, requestBody);
      })
      .catch((err) => {
        return err;
      });
  }

  public async addChildInfo(requestBody: RequestChildInfoInterface): Promise<any> {
    const covertPayLoad = ChildAddModel.create(requestBody);
    console.log(covertPayLoad,'addIno')
    return await ChildInfoDBModel.create({ ...covertPayLoad }, {
      include: [
        ChildAllergenDBModel,
        ChildDietaryDBModel,
        ChildPreferenceDBModel
      ]
    });
  }

  public async editChildInfo(id): Promise<any> {
    const t = await ChildInfoDBModel.findAll({
      include: [
        ChildDietaryDBModel,
        ChildAllergenDBModel,
        ChildPreferenceDBModel
      ],
      where: {
        child_info_id: parseInt(decrypted(id)),
      },
    });
    return t
  }

  public async getforChildInfo(parent_id: string): Promise<any> {
    return await ChildInfoDBModel.findAll({
      where: {
        parent_id: parent_id,
      },
      include: [
        {
          model: ChildDietaryDBModel,
          include: [{
            model: DietaryDBModel
          }]
        },
        {
          model: ChildAllergenDBModel,
          include: [{
            model: AllergenDBModel
          }]
        },
        {
          model: ChildPreferenceDBModel,
          include: [{
            model: NutritionCategoryDBModel
          }]
        }
      ]
    });
  }

  public async deleteForChildInfo(child_info_id: string): Promise<any> {
    try {
      return await ChildInfoDBModel.update({
        status: 'inactive'
      },
        {
          where: {
            child_info_id: parseInt(decrypted(child_info_id)),
          }
        })
    }
    catch (err) {
      return err
    }
  }

  public async updateChildInfo(requestBody: any): Promise<any> {
  const child_info_id = parseInt(decrypted(requestBody.child_info_id));
  const f = await sequelize.getSequelize.transaction();
  const dietary = requestBody.dietary.map(list => ChildDietaryEditModel.create(list, child_info_id));
  const allergen = requestBody.allergen.map(list => ChildAllergenEditModel.create(list, child_info_id));
  const nutrition_category = requestBody.nutrition_category.map(list => ChildPreferenceEditModel.create(list, child_info_id));
  try {
    const result = await Promise.all([
      ChildInfoDBModel.update({
        child_info_id: requestBody.child_info_id,
        date_of_birth: requestBody.date_of_birth,
        child_name: requestBody.child_name,
        allergen: requestBody.allergen,
        dietary: requestBody.dietary,
        nutrition_category: requestBody.nutrition_category,
      },
        {
          where: {
            child_info_id: child_info_id
          },
          transaction: f
        }),
      ChildAllergenDBModel.destroy({
        where: {
          child_info_id: child_info_id
        },
        transaction: f
      }),
      ChildAllergenDBModel.bulkCreate(allergen, { transaction: f }),
      ChildDietaryDBModel.destroy({
        where: {
          child_info_id: child_info_id
        },
        transaction: f
      }),
      ChildDietaryDBModel.bulkCreate(dietary, { transaction: f }),
      ChildPreferenceDBModel.destroy({
        where: {
          child_info_id: child_info_id
        },
        transaction: f
      }),
      ChildPreferenceDBModel.bulkCreate(nutrition_category, { transaction: f })
    ])

    await f.commit();
    return result
  } catch (error) {
    await f.rollback();
    return error;
  }
}


  public async deleteChildInfo(requestBody: any): Promise<any> {
    const childAry = requestBody.map(ids => parseInt(decrypted(ids)))
    return await ChildInfoDBModel.findAll({
      where: { child_info_id: childAry }
    }).then((child) => {
      child.forEach(val => {
        val.status = 'inactive';
        val.save()
      })
      return 'ChildInfo deleted successfully.'
    }).catch(err => {
      return 'ChildInfo is not Deleted.!'
    });

  }
  public async getAllChildInfo(): Promise<ChildInfoInterface[]> {
    return await ChildInfoDBModel.findAll({
      include: [{
        model: ParentInfoDBModel
      },
      ],
      where: {
        status: 'active'
      },
    });
  }

}