import { Router } from "express";
import { Api, decrypted, PostgresqlHelper } from "../helper";
import { AppRoute } from "../app-route";
import { CollectionResultModel } from "../model";
import { CountryService } from "../services";
import AppLogger from "../helper/app-logger";

export class CountryController implements AppRoute {

  route: string = '/country';
  router: Router = Router();
  constructor() {

    this.router.post('/get-country', this.getCountry);
    this.router.post('/add-country', this.addCountry);
    this.router.put('/delete-country', this.deleteCountry);
    this.router.put('/update-country', this.updateCountry);
    this.router.get('/get-Allcountry', this.getAllCountry);
    this.router.get('/downloadCSVcountry', this.downloadCSV);
    
  }
  
  public async getCountry(req, res): Promise<any> {
    try{
    const countryServices = new CountryService();
    await countryServices.getCountryList(req.body)
      .then((countryList) => {
        Api.ok(req, res, countryList)
      })}
      catch(error) {
        AppLogger.error('get-country', error)
        Api.invalid(req, res, { message: 'country list Failed.' })
      }
  }

  public async addCountry(req, res): Promise<any> {
    try{
    const countryServices = new CountryService();
    await countryServices.addCountry(req.body)
        .then((countryServiceList) => {
            Api.ok(req, res, { message: 'country added successfully.' })
        })}
        catch(error){
            AppLogger.error('addcountry', error)
            if(error.name === 'SequelizeValidationError') {
                Api.invalid(req, res, {
                  message: error.errors[0].message
                })
              } else {
                Api.badRequest(req, res, { message: 'country add Failed.' })
              }
        }
      }

  public async deleteCountry(req, res): Promise<any> {
    try{
    const countryServices = new CountryService();
    await countryServices.deleteCountry(req.body.id)
      .then((countryList) => {
        Api.ok(req, res, { message: 'Country deleted successfully.' })
      })}
      catch(error){
        AppLogger.error('delete-country', error)
        Api.invalid(req, res, { message: 'Country deleted Failed.' })
      }

  }
  public async updateCountry(req, res): Promise<any> {
    try{
    const countryServices = new CountryService();
    await countryServices
      .updateCountry(req.body)
      .then((countryList) => {
        Api.ok(req, res, {
          message: "Country update successfully.",
        });
      })}
      catch(error){
        AppLogger.error("deletedcountry", error);
        Api.invalid(req, res, {
          message: "Country update Failed.",
        });
      }
  }

  public async getAllCountry(req, res): Promise<any> {
    try{
    const countryServices = new CountryService();
    await countryServices.getAllCountry()
    .then((country) => {
      Api.ok(req, res, country)
    })}
    catch(error) {
      AppLogger.error("countryServices", error);
      Api.invalid(req, res, {
        message: "country getting Failed.",
      });
    }
  }

  
  public async downloadCSV(req, res): Promise<any> {
    try{
    const countryServices = new CountryService();
    const helper = new PostgresqlHelper();
    await countryServices
    .getAllCountries()
    .then((data) => {
      const fields = [
        {
          label: "country_id",
          value: (row, field) => decrypted(row[field.label]),
        },
        {
            label: "Country Code",
            value: "country_code",
          },
        {
          label: "Country Name",
          value: "country_name",
        },
              
      ];
      const FileDetails = {
        contentType: "text/csv",
        fileName: "country.csv",
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
    })}
    catch(e) {
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


