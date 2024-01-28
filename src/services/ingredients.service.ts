import { FilterBodyInterface, RequestBodyInterface, RequestIngredientInterface } from "../interface";
import { CollectionResultModel } from "../model";
import { IngredientDBModel } from "../db-models/ingredient-db.model";
import { ConvertCsvFileHelper, decrypted, PostgresqlHelper, sequelize } from "../helper";
import { Op, Sequelize } from "sequelize";
import model, { Model } from "sequelize/types/model";
import AppLogger from "../helper/app-logger";
import ModelManager from "sequelize/types/model-manager";
import { IngredientBrandModel } from "../model/ingredient.model";
import { query } from "express";
import { IngredientCategoryDBModel, SupplierDBModel, FoodCategoryDBModel, FormDBModel, MeasurementDBModel, IngredientUploadCSVDBModel } from "../db-models";
// import { jsPDF } from 'jspdf';
// import PDFDocument from 'pdfkit'


export class IngredientService {
  value: string;
  self = this;


  constructor() {


  }

  public async getIngredient(
    requestBody: Partial<RequestBodyInterface>
  ): Promise<any> {
    const searchColumn = {
      'name': 'name',
      "supplier_name": "supplier_name",
      "category": "category",
      "food_category_id": "food_category_id",
      'unit_size': 'unit_size'
    };

    const sortColunm = {
      'name': 'name',
      'unit_size': 'unit_size'
    }
    const postresSqlHelper = new PostgresqlHelper();
    const getQueryData = postresSqlHelper.tableListQuery(
      searchColumn,
      requestBody,
      IngredientDBModel,
      sortColunm
    )
    getQueryData.include = [{
      model: IngredientCategoryDBModel
    },
    {
      model: SupplierDBModel
    },
    {
      model: FoodCategoryDBModel
    },
    {
      model: FormDBModel
    },
    {
      model: MeasurementDBModel
    },
    ]

    return await IngredientDBModel.findAndCountAll(

      getQueryData
    )
      .then((data) => {

        return new CollectionResultModel(data, requestBody);
      })
      .catch((err) => {
        return err;
      });
  }

  public async addIngredient(
    requestBody: RequestIngredientInterface
  ): Promise<any> {
    return await IngredientDBModel.create({
      supplier_name: requestBody.supplier_name,
      category: requestBody.category,
      name: requestBody.name,
      quantity: requestBody.quantity,
      measurement_id: requestBody.measurement_id,
      unit_size: requestBody.unit_size,
      unit_price: requestBody.unit_price,
      priority: requestBody.priority,
      form_id: requestBody.form_id,
      cost_per_unit: requestBody.cost_per_unit,
      remark: 'test',
      conversion: requestBody.conversion,
      food_category_id: requestBody.food_category_id,
    })
  }
  public async editIngredient(id): Promise<any> {
    return await IngredientDBModel.findOne({
      where: {
        sno: decrypted(id),
      },
    });
  }



  public async viewIngredient(id?: string): Promise<any> {
    return await IngredientDBModel.findOne({
      include: [
        {
          model: IngredientCategoryDBModel
        },
        {
          model: SupplierDBModel
        },
        {
          model: FoodCategoryDBModel
        },
        {
          model: FormDBModel
        },
        {
          model: MeasurementDBModel
        },
      ], where: {
        sno: parseInt(decrypted(id)),
      },
    });
  }

  public async uniqueValidation(requestBody: any): Promise<any> {
    return await IngredientDBModel.findOne({
      where: {
        $and: Sequelize.where(
          Sequelize.fn('lower', Sequelize.col('name')),
          Sequelize.fn('lower', requestBody.name)
        ),
        status: 'active',
        sno: { [Op.ne]: requestBody.sno }
      }
    })
  }

  public async uploadCSV(csvFile: any): Promise<any> {
    // const data = this.convertHelper.convert(csvFile);
    // const ingredientData =  await IngredientUploadCSVDBModel.findAll({
    //   include: [
    //     IngredientCategoryDBModel,
    //     SupplierDBModel,
    //     FoodCategoryDBModel,
    //     FormDBModel,
    //     MeasurementDBModel,
    //   ],
    //   where: {
    //     status: 'active',
    //   },
    // });
    // try {
    //   await this.processCsvData(data, ingredientData);
    //   return data;
    // } catch (error) {
    //   throw new Error('Error uploading CSV: ' + error.message);
    // }
  }


  public async getAllIngredient(): Promise<any> {
    return await IngredientDBModel.findAll(
      {
        include: [{
          model: IngredientCategoryDBModel
        },
        {
          model: SupplierDBModel
        },
        {
          model: FoodCategoryDBModel
        },
        {
          model: FormDBModel
        },
        {
          model: MeasurementDBModel
        },
        ],
        where: {
          status: 'active'
        },
      }
    );
  }

  public async getAllIngredientBrandName(): Promise<any> {
    return await IngredientDBModel.findAll({
      attributes: ['sno', 'name'],
      where: { status: 'active' },
      order: [
        ['name', 'ASC']
      ]
    }).then(data => {
      if (data) {
        return data.map(val => new IngredientBrandModel(val))
      }
    }).catch(error => {
      return error
    })
  }


  public async deleteIngredient(requestBody: any): Promise<any> {
    const snoAry = requestBody.map(ids => parseInt(decrypted(ids)))
    return await IngredientDBModel.findAll({
      where: { sno: snoAry }
    }).then((ingredient) => {
      ingredient.forEach(val => {
        val.status = 'inactive';
        val.save()
      })
      return 'Ingredient is deleted successfully.'
    }).catch(err => {
      return 'Ingredient is not Delete.!'
    });

  }
  public async updateIngredient(requestBody: any): Promise<any> {
    const sno = parseInt(decrypted(requestBody.sno));
    return await IngredientDBModel.findOne({
      where: { sno: sno }
    }).then(ingrentList => {
      ingrentList.supplier_name = requestBody.supplier_name;
      ingrentList.category = requestBody.category;
      ingrentList.name = requestBody.name,
        ingrentList.measurement_id = requestBody.measurement_id;
      ingrentList.unit_size = requestBody.unit_size,
        ingrentList.unit_price = requestBody.unit_price,
        ingrentList.priority = requestBody.priority,
        ingrentList.form = requestBody.form,
        ingrentList.cost_per_unit = requestBody.cost_per_unit,
        ingrentList.remark = requestBody.remark,
        ingrentList.conversion = requestBody.conversion,
        ingrentList.food_category_id = requestBody.food_category_id,
        ingrentList.status = 'active';
      ingrentList.save();
      return 'Ingredient is Updated successfully.'
    }).catch(error => {
      return 'Ingredient Updated failed.!'
    });

  }
  public async getFilterIngredient(resquestBody: FilterBodyInterface): Promise<any> {
    if (resquestBody && resquestBody.category) {
      resquestBody.category = resquestBody.category
    }
    resquestBody.status = 'active';
    return await IngredientDBModel.findAll({
      where: resquestBody,

    }).then(data => {
      if (data) {
        return data.map(val => new IngredientBrandModel(val))
      }
    }).catch(error => {
      return error
    });
  }

}
