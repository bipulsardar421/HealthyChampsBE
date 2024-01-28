
import { Router } from "express";
import { Api, PostgresqlHelper, decrypted } from "../helper";
import { AppRoute } from "../app-route";
import { CollectionResultModel } from "../model";
import AppLogger from "../helper/app-logger";
import { ServingsService } from "../services";


export class ServingsController implements AppRoute {

    route: string = '/servings';
    router: Router = Router();
    constructor() {

        this.router.post('/get-servings', this.getServings);
        this.router.post('/add-servings', this.addServings);
        this.router.put('/delete-servings', this.deleteServings);
        this.router.put('/update-servings', this.updateServings);
        this.router.get('/downloadCSVServings', this.downloadCSV);
    }

    public async getServings(req, res): Promise<any> {
        const servingsServices = new ServingsService();
        await servingsServices.getServingsList(req.body)
        .then((servingsList) => {
         Api.ok(req, res, servingsList)
       }).catch((error) => {
            AppLogger.error('get-servings', error)
            Api.invalid(req, res,  {message: 'Servings list Failed.'})
        })
    }

    public async addServings(req, res): Promise<any> {
      try{
      const servingsServices = new ServingsService();
      await servingsServices.addServings(req.body)
          .then((servingsList) => {
              Api.ok(req, res, { message: 'Servings added successfully.' })
          })}
          catch(error) {
              AppLogger.error('addservings', error)
              if(error.name === 'SequelizeValidationError') {
                  Api.invalid(req, res, {
                    message: error.errors[0].message
                  })
                } else {
                  Api.badRequest(req, res, { message: 'Servings add Failed.' })
                }
          }
        }
 
        public async deleteServings(req, res): Promise<any> {
          try{
        const servingsServices = new ServingsService();
        await servingsServices
        .deleteServings(req.body.id)
        .then((servingsList) => {
            Api.ok(req, res, {
              message: 'Servings deleted successfully.',
            });
        })}
        catch(error) {
            AppLogger.error('deleted Servings', error)
            Api.invalid(req, res,  {
              message: 'Servings deleted Failed.'})
        }
    }

        public async updateServings(req, res): Promise<any> {
          try{
          const servingsServices = new ServingsService();
          await servingsServices
            .updateServings(req.body)
            .then((servingsList) => {
              Api.ok(req, res, {
                message: "Servings update successfully.",
              });
            })
          }catch(error){
              AppLogger.error("deletedservings", error);
              Api.invalid(req, res, {
                message: "servings updated Failed.",
              });
            }
        }


    public async downloadCSV(req: any, res: any): Promise<any> {
      try{
        const _servingsService = new ServingsService();
        const _helper = new PostgresqlHelper();
        await _servingsService
          .getAllServings()
          .then((data) => {
            const fields = [
              {
                label: "servings_id",
                value: (row, field) => decrypted(row[field.label]),
              },
              {
                label: "Age Group",
                value: "age_group",
              },
              {
                label: "No of Students",
                value: "no_of_students",
              },
              
            ];
            const FileDetails = {
              contentType: "text/csv",
              fileName: "Recipe.csv",
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
