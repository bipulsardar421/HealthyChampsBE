import { Router } from "express";
import { Api, decrypted, encrypted, PostgresqlHelper } from "../helper";
import { AppRoute } from "../app-route";
import { CollectionResultModel, MeasurementEditModel } from "../model";
import { MeasurementService } from "../services";
import AppLogger from "../helper/app-logger";

export class MeasurementController implements AppRoute {

  route: string = '/measurement';
  router: Router = Router();
  constructor() {
    this.router.post('/get-measurement', this.getMeasurement);
    this.router.post('/add-measurement', this.addMeasurement);
    this.router.get('./edit-measurement/:id', this.editMeasurement);
    this.router.put('/delete-measurement', this.deleteMeasurement);
    this.router.put('/update-measurement', this.updateMeasurement);
    this.router.get('/getAllMeasurement', this.getAllMeasurement);
    this.router.get('/download-measurement', this.downloadCSV);
  }
  
  public async getMeasurement(req, res): Promise<any> {
    try{
    const measurementServices = new MeasurementService();
    await measurementServices.getMeasurementList(req.body)
      .then((measurementList) => {
        Api.ok(req, res, measurementList)
      })
    }catch(error){
        AppLogger.error('getMeasurement', error)
        Api.invalid(req, res, { message: 'Measurement list Failed.' })
      }
  }

  public async addMeasurement(req: any, res: any): Promise<any> {
    try{
    const measurementServices = new MeasurementService();
    await measurementServices.addMeasurement(req.body)
    .then((measureId) => {
      Api.ok(req, res, {
        message: 'Success',
        measurement: measureId['dataValues']
    })
        })
      }catch(error){
            AppLogger.error('addMeasurement', error)
            if(error.name === 'SequelizeValidationError') {
                Api.invalid(req, res, {
                  message: error.errors[0].message
                })
              } else {
                Api.badRequest(req, res, {
                  errorCode: 500,
                  message: 'Error'
                })
              }
          }
      }

  public async editMeasurement(req: any, res: any): Promise<any> {
        const _measurementService = new MeasurementService();
        const getMeasurementList = await _measurementService
          .editMeasurement(req.params.id)
          .then((data) => {
            return res.jsonp(data);
          });
      }


  public async deleteMeasurement(req, res): Promise<any> {
    try{
    const measurementServices = new MeasurementService();
    await measurementServices.deleteMeasurement(req.body.id)
      .then((measurementList) => {
        Api.ok(req, res, { message: 'Measurement deleted successfully.' })
      })
    }catch(error){
        AppLogger.error('deletedMeasurement', error)
        Api.invalid(req, res, { message: 'Measurement deleted Failed.' })
      }
  }

  public async updateMeasurement(req, res): Promise<any> {
    try{
    const measurementServices = new MeasurementService();
    await measurementServices
      .updateMeasurement(req.body)
      .then((measurementList) => {
        if (measurementList.name === 'SequelizeValidationError') {
          Api.invalid(req, res, {
            message: measurementList.errors[0].message
          })
        } else {
          Api.ok(req, res, {
            message: "Measurement updated successfully",
          });
        }
       
      })
    }catch(error) {
      AppLogger.error('measurement updated', error)
        if (error.name === 'SequelizeValidationError') {
        Api.invalid(req, res, {
          message: error.errors[0].message
        })
      } else {
        Api.badRequest(req, res, {
          errorCode: 500,
          message: 'Measurement updated Failed.'
        })
      }
      }
  }


  public async getAllMeasurement(req, res): Promise<any> {
    try{
    const measurementServices = new MeasurementService();
    await measurementServices.getAllMeasurement()
    .then((allMeasurement) => {
      Api.ok(req, res, allMeasurement)
    })
  }catch(error){
      AppLogger.error("deletedMeasurement", error);
      Api.invalid(req, res, {
        message: "Measurement getting Failed.",
      });
    }
  }

  public async downloadCSV(req, res): Promise<any> {
    try{
    const measurementServices = new MeasurementService();
    const helper = new PostgresqlHelper();
    await measurementServices
    .getAllMeasurements()
    .then((data) => {
      const fields = [
        {
          label: "measurement_id",
          value: (row, field) => decrypted(row[field.label]),
        },
        {
          label: "Measurement Name",
          value: "measurement_name",
        },
        {
          label: "Country Name",
          value: "country_name",
        },
                   
      ];
      const FileDetails = {
        contentType: "text/csv",
        fileName: "Measurement.csv",
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


