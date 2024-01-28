import { Router } from "express";
import { Api, decrypted, PostgresqlHelper } from "../helper";
import { AppRoute } from "../app-route";
import { CollectionResultModel } from "../model";
import { NutritionService } from "../services";
import * as createCsvWriter from "csv-writer";
import AppLogger from "../helper/app-logger";
import { NutritionInterface } from "../interface";

export class NutritionController implements AppRoute {
  route = "/nutrition";
  router: Router = Router();
  nutritionService: NutritionService = null;
  self = this;
  private _nutritionService: NutritionService;
  constructor() {
    this.router.post("/getNutrition", this.getNutrition);
    this.router.post("/addNutrition", this.addNutrition);
    this.router.get("/editNutrition/:id", this.editNutrition);
    this.router.get("/downloadCSVNutrition/", this.downloadCSV);
    this.router.put('/deleteNutrition', this.deleteNutrition);
    this.router.put('/updateNutrition', this.updateNutrition);
    this.router.get("/viewNutrition/:id", this.viewNutrition);
    this._nutritionService = new NutritionService();
    // this.router.post("/uploadCSVNutrition/", this.uploadCSVNutrition);
      
  }

  public async getNutrition(req: any, res: any): Promise<any> {
    try{
    const _nutritionService = new NutritionService();
    const nutritionList = await _nutritionService
      .getNutrition(req.body)
        return res.jsonp(nutritionList);
      }
      catch(error){
        AppLogger.error('getNutrition', error)
        Api.invalid(req, res, {message:'GetNutrition List Failed'})
      }
  }

  public async viewNutrition(req, res: any): Promise<any> {
    const _nutritionService = new NutritionService();
    await _nutritionService.viewNutrition(req.params.id)
    .then(data => Api.ok(req, res, data))
    .catch(err => Api.badRequest(req, res, err))
  }


  public async addNutrition(req, res): Promise<any> {
    const _nutritionService = new NutritionService();
    await _nutritionService.addNutrition(req.body).
    then((nutritionList) => {
        Api.ok(req, res, {
          message: "Nutritional Value add successfully.",
        });
      })
      .catch((error) => {
        AppLogger.error("addNutrition", error);
        if(error.name === 'SequelizeValidationError') {
          Api.invalid(req, res, {
            message: error.errors[0].message
          })
        } else {
          Api.badRequest(req, res, { message: 'Nutrition value add Failed'})
        }
      });
}


  public async editNutrition(req: any, res: any): Promise<any> {
    try{
    const _nutritionService = new NutritionService();
     await _nutritionService
      .editNutrition(req.params.id)
      .then((data) => {
        Api.ok(req, res, data);   
      })
    }catch(error){
      Api.invalid(req, res, { message: "Edit Nutrition List Getting Failed." });
      AppLogger.error("add Nutrition", error);
    }
  }

  public async deleteNutrition(req, res): Promise<any> {
    try{
    const _nutritionService = new NutritionService();
    await _nutritionService
      .deleteNutrition(req.body.nutrition_id)
      .then((nutritionList) => {
        Api.ok(req, res, {
          message: "Nutrition Value deleted successfully.",
        });
      })
    }catch(error){
        AppLogger.error("deletednutrition", error);
        Api.invalid(req, res, {
          message: "Nutritional Value deleted Failed.",
        });
      }
  }

  public async updateNutrition(req, res): Promise<any> {
    try{
    const _nutritionService = new NutritionService();
    await _nutritionService
      .updateNutrition(req.body)
      .then((nutritionList) => {
          Api.ok(req, res, {
          message: nutritionList,
        });
      })
    }catch(error){
        AppLogger.error("deletedNutritionalValue", error);
        Api.invalid(req, res, {
          message: "Nutritional Value update Failed.",
        });
      }
  }

//   public async uploadCSVNutrition(req: any, res: any): Promise<any> {
// //     const _nutritionService = new NutritionService();
// //     const _helper = new PostgresqlHelper()
// //     // const Service = require('path/to/service');

// //    exports.uploadCSV = (req, res) => {
// //    const file = req.file;
// //   _nutritionService.uploadCSV(file)
// //   .then(data => res.status(200).send(data))
// //   .catch(error => res.status(500).send(error));
// // };
//   }




  public async downloadCSV(req: any, res: any): Promise<any> {
    try{
    const _nutritionService = new NutritionService();
    const _helper = new PostgresqlHelper();
    await _nutritionService
      .getAllNutrition()
      .then((data) => {
        const fields = [
          {
            label: "nutrition_id",
            value: (row, field) => decrypted(row[field.label]),
          },
          {
            label: "Ingredient Brand Name",
            value: "ingredient_names.name",
          },
          {
            label: "Weight",
            value: "weight",
          },
          {
            label: "Energy",
            value: "energy",
          },
          {
            label: "Protein",
            value: "protein",
          },
          {
            label: "Total Fat",
            value: "total_fat",
          },
          {
            label: "Saturated Fat",
            value: "saturated_fat",
          },
          {
            label: "Trans Fat",
            value: "trans_fat",
          },
          {
            label: "Polysat Fat",
            value: "polysat_fat",
          },
          {
            label: "Monosat Fat",
            value: "monosat_fat",
          },
          {
            label: "Carbohydrate",
            value: "carb",
          },
          {
            label: "Sugar",
            value: "sugar",
          },
          {
            label: "Added Sugar",
            value: "added_sugar",
          },
          {
            label: "Free Sugar",
            value: "free_sugar",
          },
          {
            label: "Dietery Fibre",
            value: "dietery_fibre",
          },
          {
            label: "Thiamin",
            value: "thiamin",
          },
          {
            label: "Riboflarin",
            value: "riboflarin",
          },
          {
            label: "Niacin",
            value: "niacin",
          },
          {
            label: "Vitamin C",
            value: "vitamin_c",
          },
          {
            label: "Vitamin_E",
            value: "vitamin_e",
          },
          {
            label: "Vitamin B6",
            value: "vitamin_b6",
          },
          {
            label: "Vitamin B12",
            value: "vitamin_b12",
          },
          {
            label: "Total Folate",
            value: "total_folate",
          },
          {
            label: "Total Vitamin A",
            value: "total_vitamin_a",
          },
          {
            label: "Sodium",
            value: "sodium",
          },
          {
            label: "Potassium",
            value: "potassium",
          },
          {
            label: "Magnessium",
            value: "magnessium",
          },
          {
            label: "Calcium",
            value: "calcium",
          },
          {
            label: "Phosphorus",
            value: "phosphorus",
          },
          {
            label: "Iron",
            value: "iron",
          },
          {
            label: "Zinc",
            value: "zinc",
          },
          {
            label: "Selenium",
            value: "selenium",
          },
          {
            label: "Iodine",
            value: "iodine",
          },
          {
            label: "Omega3",
            value: "omega3",
          },
          {
            label: "Protien Foods",
            value: "protien_foods",
          },
          {
            label: "CreatedAt",
            value: "createdAt",
          },
          {
            label: "UpdatedAt",
            value: "updatedAt",
          },
          
        ];
        const FileDetails = {
          contentType: "text/csv",
          fileName: "nutritionvalue.csv",
          csv: _helper.downloadResouce(fields, data),
        };

        if (
          FileDetails &&
          FileDetails.contentType === "text/csv" &&
          FileDetails.csv
        ) {
          res.setHeader(
            "content-disposition",
            `attachment; filename=${FileDetails.fileName}`
          );
          res.setHeader("Content-Type", "text/csv");
          res.attachment(FileDetails.fileName);
          return res.status(200).send(FileDetails.csv);
        }

        res.set("Content-Type", "application/json");
        res.type("json");
        const body = {
          success: true,
          code: 200,
          data: FileDetails,
        };
        res.status(200).send(body);
      })
    }catch(e){
        res.status(400).send({
          success: false,
          code: 400,
          error: {
            description: e?.errors?.customsCode?.message || e.message,
          },
        });
      }
  }

}
