import { Router } from "express";
import { Api, decrypted, PostgresqlHelper } from "../helper";
import { AgeGroupService } from "../services";
import { AppRoute } from "../app-route";
import AppLogger from "../helper/app-logger";


export class AgeGroupController implements AppRoute {
    route: string = '/age-group';
    router: Router = Router();

    constructor() {
        this.router.post('/get-age-group', this.getAgeGroup);
        this.router.post('/add-age-group', this.addAgeGroup);
        this.router.put('/delete-age-group', this.deleteAgeGroup);
        this.router.put('/update-age-group', this.updateAgeGroup);
        this.router.get('/all-age-group', this.getAllAgeGroup)
        this.router.get('/downloadCSVAgeGroup', this.downloadCSV);
       
    } 

    public async getAgeGroup(req, res): Promise<any> {
      try{
        const ageGroupServices = new AgeGroupService();
        await ageGroupServices.getAgeGroupList(req.body)
            .then((ageGroupServiceList) => {
                Api.ok(req, res, ageGroupServiceList)
            })
          }catch(error) {
                AppLogger.error('getAgeGroup', error)
                Api.invalid(req, res, { message: 'Age Group list Failed.' })
            }
    }

    public async addAgeGroup(req, res): Promise<any> {
      try{
        const ageGroupServices = new AgeGroupService(); 
        await ageGroupServices.addAgeGroup(req.body)
            .then((ageGroupServiceList) => {
                Api.ok(req, res, { message: 'Age Group added successfully.' })
            })
          }catch(error) {
                AppLogger.error('addAgeGroup', error)
                if(error.name === 'SequelizeValidationError') {
                    Api.invalid(req, res, {
                      message: error.errors[0].message
                    })
                  } else {
                    Api.badRequest(req, res, { message: 'Age Group add Failed.' })
                  }
            }
      }
      

    public async deleteAgeGroup(req, res): Promise<any> {
      try{
        const ageGroupServices = new AgeGroupService();
        await ageGroupServices.deleteAgeGroup(req.body.id)
            .then((ageGroupServiceList) => {
                Api.ok(req, res, { message: 'Age Group deleted successfully.' })
            })
          }catch(error)  {
                AppLogger.error('deletedAgeGroup', error)
                Api.invalid(req, res, { message: 'Age Group deleted Failed.' })
            }
    }

    
    public async updateAgeGroup(req, res): Promise<any> {
      try{
        const ageGroupServices = new AgeGroupService();
        await ageGroupServices
            .updateAgeGroup(req.body)
            .then((ageGroupServiceList) => {
                Api.ok(req, res, {
                    message: "AgeGroup updated successfully.",
                });
            })
          }catch(error) {
                AppLogger.error("deletedAgeGroup", error);
                Api.invalid(req, res, {
                    message: "AgeGroup update Failed.",
                });
            };
    }
   

    public async getAllAgeGroup(req, res): Promise<any> {
      try{
        const ageGroupServices = new AgeGroupService();
        await ageGroupServices.getAllAgeGroup()
        .then((allAgeGroup) => {
          Api.ok(req, res, allAgeGroup)
        })
      }catch(error) {
          AppLogger.error("deletedAgeGroup", error);
          Api.invalid(req, res, {
            message: "AgeGroup getting Failed.",
          });
        }
      }
    
    public async downloadCSV(req, res): Promise<any> {
      try{
      const ageGroupServices = new AgeGroupService();
      const helper = new PostgresqlHelper();
      await ageGroupServices
      .getAllAgeGroups()
      .then((data) => {
        const fields = [
          {
            label: "age_group_id",
            value: (row, field) => decrypted(row[field.label]),
          },
          {
            label: "Age Group",
            value: "age_group",
          },
                
        ];
        const FileDetails = {
          contentType: "text/csv",
          fileName: "Agegroup.csv",
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
      };
  }
}
