import { Router } from "express";
import { Api, decrypted, PostgresqlHelper } from "../helper";
import { NutritionCategoryService } from "../services/nutrition-category.service";
import { AppRoute } from "../app-route";
import AppLogger from "../helper/app-logger";
import { Console } from "console";

export class NutritionCategoryController implements AppRoute {
  route = "/nutrition-category";
  router: Router = Router();

    constructor() {
        this.router.post('/get-nutrition-category', this.getNutritionsCategory);
        this.router.post('/add-nutrition-category', this.addNutritionsCategory);
        this.router.put('/delete-nutrition-category', this.deleteNutritionCat);
        this.router.put('/update-nutrition-category', this.updateNutritionCat);
        this.router.get('/allNutritioncat',this.getAllNutritionCat);
        this.router.get('/downloadCSVNutritionCat', this.downloadCSV);
    }


  public async getNutritionsCategory(req, res): Promise<any> {
    try{
    const nutritionCategoryServices = new NutritionCategoryService();
    await nutritionCategoryServices
      .getNutritionCategoryList(req.body)
      .then((nutritionCategoryList) => {
        Api.ok(req, res, nutritionCategoryList);
      })
    }catch(error){
        AppLogger.error("getNutritionsCategory", error);
        Api.invalid(req, res, { message: "Nutrition category list Failed." });
      }
  }

  public async addNutritionsCategory(req, res): Promise<any> {
    try{
    const nutritionCategoryServices = new NutritionCategoryService();
    await nutritionCategoryServices.addNutritionCategory(req.body)
        .then((nutritionCategoryList) => {
            Api.ok(req, res, { message: 'Nutrition Category added successfully.' })
        })
      }catch(error){
            AppLogger.error('addNutritionCategory', error)
            if(error.name === 'SequelizeValidationError') {
                Api.invalid(req, res, {
                  message: error.errors[0].message
                })
              } else {
                Api.badRequest(req, res, { message: 'Nutrition Category add Failed.' })
              }
        }
      }

  public async deleteNutritionCat(req, res): Promise<any> {
    try{
    const nutritionCategoryServices = new NutritionCategoryService();
    await nutritionCategoryServices
      .deleteNutritionCat(req.body.id)
      .then((nutritionCategoryList) => {
        Api.ok(req, res, {
          message: "Nutrition category deleted successfully.",
        });
      })
    }catch(error){
        AppLogger.error("deletedNutritionsCategory", error);
        Api.invalid(req, res, {
          message: "Nutrition category deleted Failed.",
        });
      }
  }

  public async updateNutritionCat(req, res): Promise<any> {
    try{
    const nutritionCategoryServices = new NutritionCategoryService();
    await nutritionCategoryServices
      .updateNutritionCat(req.body)
      .then((nutritionCategoryList) => {
        Api.ok(req, res, {
          message: "Nutrition Category update successfully.",
        });
      })
    }catch(error){
        AppLogger.error("deletedNutritionsCategory", error);
        Api.invalid(req, res, {
          message: "Nutrition Category update Failed.",
        });
      }
  }

    public async getAllNutritionCat(req, res): Promise<any>{
        try{
        const nutritionCategoryServices = new NutritionCategoryService();
        await nutritionCategoryServices.getNutritionCat().then((allnutritioncat) => {
            Api.ok(req, res, allnutritioncat)
        })
      }catch(error){
            AppLogger.error('getAllNutritionCat', error)
        }
    }

    public async downloadCSV(req, res): Promise<any> {
      try{
      const nutritionCategoryServices = new NutritionCategoryService();
      const helper = new PostgresqlHelper();
      await nutritionCategoryServices
      .getAllNutritionCat()
      .then((data) => {
        const fields = [
          {
            label: "nutrition_category_id",
            value: (row, field) => decrypted(row[field.label]),
          },
          {
            label: "Nutrition Category",
            value: "nutrition_category",
          },
                     
        ];
        const FileDetails = {
          contentType: "text/csv",
          fileName: "Nutrition Category.csv",
          csv: helper.downloadResouce(fields, data),
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

