import { Router } from "express";
import { Api, decrypted, PostgresqlHelper } from "../helper";
import { AppRoute } from "../app-route";
import { CollectionResultModel } from "../model";
import { AllergenService } from "../services";
import AppLogger from "../helper/app-logger";

export class AllergenController implements AppRoute {

  route: string = '/allergen';
  router: Router = Router();
  constructor() {

    this.router.post('/get-allergen', this.getAllergen);
    this.router.post('/add-allergen', this.addAllergen);
    this.router.put('/delete-allergen', this.deleteAllergen);
    this.router.put('/update-allergen', this.updateAllergen);
    this.router.get('/getAllergen', this.getAllAllergen);
    this.router.get('/downloadCSVAllergen', this.downloadCSV);
  }
  
  public async getAllergen(req, res): Promise<any> {
    try{
    const allergenServices = new AllergenService();
    await allergenServices.getAllergenList(req.body)
      .then((allergenList) => {
        Api.ok(req, res, allergenList)
      })}
      catch(error) {
        AppLogger.error('get-allergen', error)
        Api.invalid(req, res, { message: 'Allergen list Failed.' })
      }
  }

  public async addAllergen(req, res): Promise<any> {
    try{
    const allergenServices = new AllergenService();
    await allergenServices.addAllergen(req.body)
        .then((allergenServiceList) => {
            Api.ok(req, res, { message: 'Allergen added successfully.' })
        })
      }catch(error) {
            AppLogger.error('addAllergen', error)
            if(error.name === 'SequelizeValidationError') {
                Api.invalid(req, res, {
                  message: error.errors[0].message
                })
              } else {
                Api.badRequest(req, res, { message: 'Allergen add Failed.' })
              }
        }
      }

  public async deleteAllergen(req, res): Promise<any> {
    try{
    const allergenServices = new AllergenService();
    await allergenServices.deleteAllergen(req.body.id)
      .then((allergenList) => {
        Api.ok(req, res, { message: 'Allergen deleted successfully.' })
      })
    }catch(error){
        AppLogger.error('deletedAllergen', error)
        Api.invalid(req, res, { message: 'Allergen deleted Failed.' })
      }
  }
  public async updateAllergen(req, res): Promise<any> {
    try{
    const allergenServices = new AllergenService();
    await allergenServices
      .updateAllergen(req.body)
      .then((allergenList) => {
        Api.ok(req, res, {
          message: "Allergen update successfully.",
        });
      })
    }catch(error) {
        AppLogger.error("deletedAllergen", error);
        Api.invalid(req, res, {
          message: "Allergen update Failed.",
        });
      };
  }

  public async getAllAllergen(req, res): Promise<any> {
    try{
    const allergenServices = new AllergenService();
    await allergenServices.getAllAllergen()
    .then((allergen) => {
      Api.ok(req, res, allergen)
    })
  }catch(error) {
      AppLogger.error("allergenServices", error);
      Api.invalid(req, res, {
        message: "Allergen getting Failed.",
      });
    }
  }
  public async downloadCSV(req, res): Promise<any> {
    try{
    const allergenServices = new AllergenService();
    const helper = new PostgresqlHelper();
    await allergenServices
    .getAllAllergens()
    .then((data) => {
      const fields = [
        {
          label: "allergen_id",
          value: (row, field) => decrypted(row[field.label]),
        },
        {
          label: "Allergen",
          value: "allergen",
        },
           
      ];
      const FileDetails = {
        contentType: "text/csv",
        fileName: "Allergen.csv",
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
    };
}
}


