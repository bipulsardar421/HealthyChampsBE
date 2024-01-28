import { Router } from "express";
import { Api, decrypted, PostgresqlHelper } from "../helper";
import { AppRoute } from "../app-route";
import { CollectionResultModel } from "../model";
import { DietaryService } from "../services";
import AppLogger from "../helper/app-logger";
import { DietaryInterface } from "src/interface";

export class DietaryController implements AppRoute {

    route: string = '/dietary';
    router: Router = Router();
    constructor() {

        this.router.post('/get-dietary', this.getDietary);
        this.router.post('/add-dietary', this.addDietary);
        this.router.put('/delete-dietary', this.deleteDietary);
        this.router.put('/update-dietary', this.updateDietary);
        this.router.get('/get-AllDietary', this.getAllDietary);
        this.router.get('/downloadCSVDietary', this.downloadCSV);
        this.router.post('/unique', this.uniqueValidation);
    }

    public async getDietary(req, res): Promise<any> {
      try{
        const dietaryServices = new DietaryService();
        await dietaryServices.getDietaryList(req.body)
        .then((dietaryList) => {
         Api.ok(req, res, dietaryList)
       })
      }catch(error) {
            AppLogger.error('get-dietary', error)
            Api.invalid(req, res,  {message: 'Dietary list Failed.'})
        }
    }
   
    public async addDietary(req, res): Promise<any> {
      try{
      const dietaryServices = new DietaryService();
      await dietaryServices.addDietary(req.body)
          .then((dietaryList) => {
              Api.ok(req, res, { message: 'Dietary added successfully.' })
          })
        }catch(error) {
              AppLogger.error('addDietary', error)
              if(error.name === 'SequelizeValidationError') {
                  Api.invalid(req, res, {
                    message: error.errors[0].message
                  })
                } else {
                  Api.badRequest(req, res, { message: 'Dietary add Failed.' })
                }
          }
        }

public async deleteDietary(req, res): Promise<any> {
  try{
    const dietaryServices = new DietaryService();
    await dietaryServices.deleteDietary(req.body.id)
        .then((dietaryList) => {
            Api.ok(req, res, {message: 'Dietary deleted successfully.'})
        })
      }catch(error){
            AppLogger.error('deletedDietary', error)
            Api.invalid(req, res,  {message: 'Dietary deleted Failed.'})
        } 
    }



public async updateDietary(req, res): Promise<any> {
  try{
    const dietaryServices = new DietaryService();
    await dietaryServices
      .updateDietary(req.body)
      .then((dietaryList) => {
          Api.ok(req, res, {
          message: "Dietary update successfully.",
        });
      })
    }catch(error){
        AppLogger.error("deletedDietary", error);
        Api.invalid(req, res, {
          message: "Dietary update Failed.",
        });
      }
  }

public async getAllDietary(req, res): Promise<any> {
  try{
    const dietaryServices = new DietaryService();
    await dietaryServices.getAllDietary()
    .then((allDietary) => {
      Api.ok(req, res, allDietary)
    })
  }catch(error){
      AppLogger.error("deletedDietary", error);
      Api.invalid(req, res, {
        message: "Dietary getting Failed.",
      });
    }
  }
  public async downloadCSV(req, res): Promise<any> {
    try{
    const dietaryServices = new DietaryService();
    const helper = new PostgresqlHelper();
    await dietaryServices
    .getAllDietaries()
    .then((data) => {
      const fields = [
        {
          label: "dietary_id",
          value: (row, field) => decrypted(row[field.label]),
        },
        {
          label: "Dietary",
          value: "dietary",
        },
        {
          label: "Abbreviation",
          value: "abbreviation",
        },
        {
          label: "Glossary",
          value: "glossary",
        },
            
      ];
      const FileDetails = {
        contentType: "text/csv",
        fileName: "Dietary.csv",
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

public async uniqueValidation(req: any, res: any): Promise<any> {
  const _dietaryService = new DietaryService();
  await _dietaryService
    .uniqueValidation(req.body)
    .then((data) => {
      return res.jsonp(data);
    });
}

}
