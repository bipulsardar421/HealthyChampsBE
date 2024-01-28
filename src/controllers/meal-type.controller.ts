import { Router } from "express";
import { Api, decrypted, PostgresqlHelper } from "../helper";
import { MealTypeService } from "../services";
import { AppRoute } from "../app-route";
import AppLogger from "../helper/app-logger";


export class MealTypeController implements AppRoute {
  route = "/meal-type";
  router: Router = Router();

    constructor() {
        this.router.post('/get-meal-type', this.getMealType);
        this.router.post('/add-meal-type', this.addMealType);
        this.router.put('/delete-meal-type', this.deleteMealType);
        this.router.put('/update-meal-type', this.updateMealType);
        this.router.get('/allmeal-type',this.getAllMealType);
        this.router.get('/download-meal-type', this.downloadMealType);
       }


  public async getMealType(req, res): Promise<any> {
    try{
    const mealTypeServices = new MealTypeService();
    await mealTypeServices
      .getMealTypeList(req.body)
      .then((mealTypeList) => {
        Api.ok(req, res, mealTypeList);
      })
    }catch(error){
        AppLogger.error("getMealType", error);
        Api.invalid(req, res, { message: "Meal Type list Failed." });
      }
  }

  public async addMealType(req, res): Promise<any> {
    try{
    const mealTypeServices = new MealTypeService();
    await mealTypeServices.addMealType(req.body)
        .then((mealTypeList) => {
            Api.ok(req, res, { message: 'Meal Type added successfully.' })
        })
      }catch(error) {
            AppLogger.error('addMealType', error)
            if(error.name === 'SequelizeValidationError') {
                Api.invalid(req, res, {
                  message: error.errors[0].message
                })
              } else {
                Api.badRequest(req, res, { message: 'Meal Type add Failed.' })
              }
        }
      }

  public async deleteMealType(req, res): Promise<any> {
    try{
    const mealTypeServices = new MealTypeService();
    await mealTypeServices
      .deleteMealType(req.body.id)
      .then((mealTypeList) => {
        Api.ok(req, res, {
          message: "Meal Type deleted successfully.",
        });
      })
    }catch(error){
        AppLogger.error("deletedMealType", error);
        Api.invalid(req, res, {
          message: "Meal Type deleted Failed.",
        });
      }
  }

  public async updateMealType(req, res): Promise<any> {
    try{
    const mealTypeServices = new MealTypeService();
    await mealTypeServices
      .updateMealType(req.body)
      .then((mealTypeList) => {
        Api.ok(req, res, {
          message: "Meal Type update successfully.",
        });
      })
    }catch(error){
        AppLogger.error("deleted MealType", error);
        Api.invalid(req, res, {
          message: "Meal Type update Failed.",
        });
      }
  }

    public async getAllMealType(req, res): Promise<any>{
        try{
        const mealTypeServices = new MealTypeService();
        await mealTypeServices.getMealType().then((allmealtype) => {
            Api.ok(req, res, allmealtype)
       })
      }catch(error){
            AppLogger.error('getAllMealType', error)
        }

    }
    public async downloadMealType(req, res): Promise<any> {
      try{
      const highlynutritionalServices = new MealTypeService();
      const helper = new PostgresqlHelper();
      await highlynutritionalServices
      .getAllMealType()
      .then((data) => {
        const fields = [
          {
            label: "meal_type_id",
            value: (row, field) => decrypted(row[field.label]),
          },
          {
            label: "Meal Type",
            value: "meal_type",
          },
                     
        ];
        const FileDetails = {
          contentType: "text/csv",
          fileName: "Mealtype.csv",
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

