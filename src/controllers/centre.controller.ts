import { Router } from "express";
import { Api } from "../helper";
import {  decrypted, PostgresqlHelper } from "../helper";
import { CentreService } from "../services";
import { AppRoute } from "../app-route";
import AppLogger from "../helper/app-logger";

 
export class CentreController implements AppRoute {
    route: string = '/centre';
    router: Router = Router();
 
    constructor() {
        this.router.post('/get-centre', this.getCentre);
        this.router.get("/editCentre/:id", this.editCentre);
        this.router.post('/add-centre', this.addCentre);
        this.router.put('/delete-centre', this.deleteCentre);
        this.router.put('/update-centre', this.updateCentre);
        this.router.get('/downloadCSVCentre', this.downloadCSV);
        this.router.get('/get-All-Centre', this.getAllCentre);
    }
 
    public async getCentre(req, res): Promise<any> {
      try{
        const centreServices = new CentreService();
        await centreServices.getCentreList(req.body)
        .then((centreList) => {
            Api.ok(req, res, centreList)
        })
      }catch(error) {
            AppLogger.error('getCentre', error)
            Api.invalid(req, res,  {message: 'Centre list Falied.'})
        }
    }
 
    public async addCentre(req, res):  Promise<any> {
      try{
        const centreServices = new CentreService();
        await centreServices.addCentre(req.body)
        .then((centreList) => {
            Api.ok(req, res, {message: 'Centre add successfully.'})
        })
      }catch(error) {
            AppLogger.error('addCentre', error)
            Api.invalid(req, res,  {message: 'Centre add Falied.'})
        }
    }
 
    public async deleteCentre(req, res): Promise<any> {
      try{
        const centreServices = new CentreService();
        await centreServices.deleteCentre(req.body.id)
        .then((centreList) => {
            Api.ok(req, res, {message: 'Centre deleted successfully.'})
        })
      }catch(error){
            AppLogger.error('deletedCentre', error)
            Api.invalid(req, res,  {message: 'Centre deleted Falied.'})
        }
    }


    public async editCentre(req: any, res: any): Promise<any>
     {
      const _centreService = new CentreService();
      const getCentreList = await _centreService
        .editCentre(req.params.id)
        .then((data) => {
          return res.jsonp(data);
        });
     }

    
    public async updateCentre(req, res): Promise<any> {
      try{
      const centreServices = new CentreService();
      await centreServices
        .updateCentre(req.body)
        .then((centreList) => {
            Api.ok(req, res, {
            message: "Centre update successfully.",
          });
        })
      }catch(error) {
          AppLogger.error("updatedCentre", error);
          Api.invalid(req, res, {
            message: "Centre update Failed.",
          });
        }
    }

    public async getAllCentre(req, res): Promise<any> {
      try{
      const centreServices = new CentreService();
      await centreServices.getAllCentre()
      .then((centre) => {
        Api.ok(req, res, centre)
      })}
      catch(error) {
        AppLogger.error("centreServices", error);
        Api.invalid(req, res, {
          message: "centre getting Failed.",
        });
      }
    }
    
  public async downloadCSV(req: any, res: any): Promise<any> {
    try{
    const _centreService = new CentreService();
    const _helper = new PostgresqlHelper();
    await _centreService
      .getAllCentres()
      .then((data) => {
        const fields = [
          {
            label: "centre_id",
            value: (row, field) => decrypted(row[field.label]),
          },
          {
            label: "Centre ID",
            value: "centre_ID",
          },
          {
            label: "Country",
            value: "countries.country_name",
          },
          {
            label: "Centre Name",
            value: "centre_name",
          },
          {
            label: "Centre Location",
            value: "centre_location",
          },
        ];
        const FileDetails = {
          contentType: "text/csv",
          fileName: "Centre.csv",
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
