import { Router } from "express";
import { Api, decrypted, PostgresqlHelper } from "../helper";
import { HighlyNutritionalService } from "../services";
import { AppRoute } from "../app-route";
import AppLogger from "../helper/app-logger";
import { Console } from "console";

export class HighlyNutritionalController implements AppRoute {
  route = "/highly-nutritional";
  router: Router = Router();

    constructor() {
        this.router.post('/get-highly-nutritional', this.getHighlyNutrition);
        this.router.post('/add-highly-nutritional', this.addHighlyNutrition);
        this.router.put('/delete-highly-nutritional', this.deleteHighlyNutrition);
        this.router.put('/update-highly-nutritional', this.updateHighlyNutrition);
        this.router.get('/getallhighly-nutritional',this.getAllHighlyNutrition);
        this.router.get('/downloadCSVHighNutri', this.downloadHighlyNutrition);
    }


  public async getHighlyNutrition(req, res): Promise<any> {
    try{
    const highlyNutritionalServices = new HighlyNutritionalService();
    await highlyNutritionalServices
      .getHighlyNutritionList(req.body)
      .then((highlynutritionList) => {
        Api.ok(req, res, highlynutritionList);
      })
    }catch(error) {
        AppLogger.error("getHighlyNutrition", error);
        Api.invalid(req, res, { message: "Highly Nutrition list Failed." });
      }
  }

  public async addHighlyNutrition(req, res): Promise<any> {
    try{
    const  highlyNutritionalServices = new HighlyNutritionalService();
    await  highlyNutritionalServices.addHighlyNutrition(req.body)
        .then((highlynutritionList) => {
            Api.ok(req, res, { message: 'Highly Nutrition added successfully.' })
        })
      }catch(error){
            AppLogger.error('addHighlyNutrition', error)
            if(error.name === 'SequelizeValidationError') {
                Api.invalid(req, res, {
                  message: error.errors[0].message
                })
              } else {
                Api.badRequest(req, res, { message: 'Highly Nutrition add Failed.' })
              }
        }
      }

  public async deleteHighlyNutrition(req, res): Promise<any> {
    try{
    const highlyNutritionalServices = new HighlyNutritionalService();
    await highlyNutritionalServices
      .deleteHighlyNutrition(req.body.id)
      .then((highlynutritionList) => {
        Api.ok(req, res, {
          message: "Highly Nutritional deleted successfully.",
        });
      })
    }catch(error){
        AppLogger.error("deletedHighlyNutritional", error);
        Api.invalid(req, res, {
          message: "Highly Nutritional deleted Failed.",
        });
      }
  }

  public async updateHighlyNutrition(req, res): Promise<any> {
    try{
    const highlyNutritionalServices = new HighlyNutritionalService();
    await highlyNutritionalServices
      .updateHighlyNutrition(req.body)
      .then((highlynutritionalList) => {
        Api.ok(req, res, {
          message: "Highly Nutritional updated successfully.",
        });
      })
    }catch(error){
        AppLogger.error("deletedHighlyNutrition", error);
        Api.invalid(req, res, {
          message: "Highly Nutritional update Failed.",
        });
      }
  }

    public async getAllHighlyNutrition(req, res): Promise<any>{
         try{
        const highlynutritionalServices = new HighlyNutritionalService();
        await highlynutritionalServices.getHighlyNutrition().then((allhighlyNutrition) => {
            Api.ok(req, res, allhighlyNutrition)
         })
        }catch(error){
            AppLogger.error('getAllHighlyNutrition', error)
        }
    }

    public async downloadHighlyNutrition(req, res): Promise<any> {
      try{
      const highlynutritionalServices = new HighlyNutritionalService();
      const helper = new PostgresqlHelper();
      await highlynutritionalServices
      .getAllHighNutrition()
      .then((data) => {
        const fields = [
          {
            label: "highly_nutritional_id",
            value: (row, field) => decrypted(row[field.label]),
          },
          {
            label: "Highly Nutritional",
            value: "highly_nutritional",
          },
                     
        ];
        const FileDetails = {
          contentType: "text/csv",
          fileName: "Highly Nutrition.csv",
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
    }catch(e) {
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

