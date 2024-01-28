import { Router } from "express";
import { Api, decrypted, PostgresqlHelper } from "../helper";
import { TermsandconditionsService } from "../services";
import { AppRoute } from "../app-route";
import AppLogger from "../helper/app-logger";


export class TermsandconditionsController implements AppRoute {
  route: string = '/termsandconditions';
  router: Router = Router();

  constructor() {
    this.router.post('/get-termsandconditions', this.getTermsandconditions);
    this.router.post('/add-termsandconditions', this.addTermsandconditions);
    this.router.put('/delete-termsandconditions', this.deleteTermsandconditions);
    this.router.get('/edit-termsandconditions/:id', this.editTermsandconditions);
    this.router.get('/alltermsandconditions', this.getAllTermsandconditions);
    this.router.put('/update-termsandconditions', this.updateTermsandconditions);
    this.router.get('/download-termsandconditions', this.downloadCSV);
    this.router.get('/getTermsAndConditions', this.getTermsAndConditions);

  }


  public async getTermsAndConditions(req, res) {
    try {
      const termsandconditionsServices = new TermsandconditionsService();
      const termsAndConditionsList = await termsandconditionsServices.getTermsAndConditions();

      Api.ok(req, res, termsAndConditionsList);
    } catch (error) {
      Api.invalid(req, res, { message: "Terms and conditions Getting Failed." });
      AppLogger.error("Error retrieving terms and conditions:", error);
    }
  }


  public async getTermsandconditions(req, res): Promise<any> {
    const termsandconditionsServices = new TermsandconditionsService();
    await termsandconditionsServices.getTermsandconditionsList(req.body)
      .then((termsandconditionsList) => {
        Api.ok(req, res, termsandconditionsList)
      }).catch((error) => {
        AppLogger.error('getTermsandconditions', error)
        Api.invalid(req, res, { message: 'Terms and conditions list Failed.' })
      })
  }
  public async editTermsandconditions(req: any, res: any): Promise<any> {
    const termsandconditionsServices = new TermsandconditionsService();
    const getTermsandconditionsList = await termsandconditionsServices
      .editTermsandconditions(req.params.id)
      .then((data) => {
        return res.jsonp(data);
      })
      .catch(err => {
        Api.invalid(req, res, { message: "Terms and conditions Getting Failed." });
        AppLogger.error("add Terms and conditions", err);
      });
  }
  public async addTermsandconditions(req, res): Promise<any> {
    const termsandconditionsServices = new TermsandconditionsService();
    await termsandconditionsServices.addTermsandconditions(req.body)
      .then((termsandconditionsList) => {
        Api.ok(req, res, { message: 'Termsandconditions add successfully.' })
      }).catch((error) => {
        AppLogger.error('addTermsandconditions', error)
        if (error.name === 'SequelizeValidationError') {
          Api.invalid(req, res, {
            message: error.errors[0].message
          })
        } else {
          Api.badRequest(req, res, {
            errorCode: 500,
            message: 'Error'
          })
        }
      })
  }
  public async deleteTermsandconditions(req, res): Promise<any> {
    const subscriptionServices = new TermsandconditionsService();
    await subscriptionServices.deleteTermsandconditions(req.body.termsandconditions_id)
      .then((subscriptionList) => {
        Api.ok(req, res, { message: 'Termsandconditions deleted successfully.' })
      }).catch((error) => {
        AppLogger.error('delete Termsandconditions', error)
        Api.invalid(req, res, { message: 'Termsandconditions deleted Falied.' })
      })
  }

  public async getAllTermsandconditions(req, res): Promise<any> {
    const termsandconditionsServices = new TermsandconditionsService();
    await termsandconditionsServices.getTermsandconditions().then((alltermsandconditions) => {
      Api.ok(req, res, alltermsandconditions)
    }).catch((error) => {
      AppLogger.error('getAllTermsandconditions', error)

    })

  }
  public async updateTermsandconditions(req, res): Promise<any> {
    const termsandconditionsServices = new TermsandconditionsService();
    await termsandconditionsServices
      .updateTermsandconditions(req.body)
      .then((TermsandconditionsList) => {
        Api.ok(req, res, {
          message: "Termsandconditions updated successfully.",
        });
      })
      .catch((error) => {
        AppLogger.error("deleted Termsandconditions", error);
        Api.invalid(req, res, {
          message: "Termsandconditions update Failed.",
        });
      });
  }
  public async downloadCSV(req, res): Promise<any> {
    const termsandconditionsServices = new TermsandconditionsService();
    const helper = new PostgresqlHelper();
    await termsandconditionsServices
      .getAllTermsandconditions()
      .then((data) => {
        const fields = [
          {
            label: "termsandconditions_id",
            value: (row, field) => decrypted(row[field.label]),
          },
          {
            label: "termsandconditions_name",
            value: "termsandconditions_name",
          },
          {
            label: "applicable_for",
            value: "applicable_for",
          },
          {
            label: "content",
            value: "content",
          },
        ];
        const FileDetails = {
          contentType: "text/csv",
          fileName: "Termsandconditions.csv",
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
      .catch((e) => {
        res.status(400).send({
          success: false,
          code: 400,
          error: {
            description: e?.errors?.customsCode?.message || e.message,
          },
        });
      });
  }


}

