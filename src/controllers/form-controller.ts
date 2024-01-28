import { Router } from "express";
import { Api, decrypted, PostgresqlHelper } from "../helper";
import { AppRoute } from "../app-route";
import { CollectionResultModel } from "../model";
import { FormService } from "../services";
import AppLogger from "../helper/app-logger";
import { FormInterface } from "src/interface";

export class FormController implements AppRoute {

    route: string = '/form';
    router: Router = Router();
    constructor() {

        this.router.post('/get-form', this.getForm);
        this.router.post('/add-form', this.addForm);
        this.router.put('/delete-form', this.deleteForm);
        this.router.put('/update-form', this.updateForm);
        this.router.get('/get-AllForm', this.getAllForm);
        this.router.get('/downloadCSVForm', this.downloadCSV);
    }

    public async getForm(req, res): Promise<any> {
      try{
        const formServices = new FormService();
        await formServices.getFormList(req.body)
        .then((formList) => {
         Api.ok(req, res, formList)
       })
      }catch(error){
            AppLogger.error('getForm', error)
            Api.invalid(req, res,  {message: 'Form list Failed.'})
        }
    }
   
   public async addForm(req, res): Promise<any> {
    try{
      const formServices = new FormService();
      await formServices.addForm(req.body)
          .then((formList) => {
              Api.ok(req, res, { message: 'Form added successfully.' })
          })
        }catch(error){
              AppLogger.error('addForm', error)
              if(error.name === 'SequelizeValidationError') {
                  Api.invalid(req, res, {
                    message: error.errors[0].message
                  })
                } else {
                  Api.badRequest(req, res, { message: 'Form add Failed.' })
                }
          }
        }

    public async deleteForm(req, res): Promise<any> {
      try{
        const formServices = new FormService();
        await formServices.deleteForm(req.body.id)
        .then((formList) => {
            Api.ok(req, res, {message: 'Form deleted successfully.'})
        })
      }catch(error){
            AppLogger.error('deletedForm', error)
            Api.invalid(req, res,  {message: 'Form deleted Failed.'})
        } 
    
}
    public async updateForm(req, res): Promise<any> {
      try{
    const formServices = new FormService();
    await formServices
      .updateForm(req.body)
      .then((formList) => {
        Api.ok(req, res, {
          message: "Form update successfully.",
        });
      })
    }catch(error){
        AppLogger.error("deletedForm", error);
        Api.invalid(req, res, {
          message: "Form update Failed.",
        });
      }
  }

  public async getAllForm(req, res): Promise<any> {
    try{
    const formServices = new FormService();
    await formServices.getAllForm()
    .then((allForm) => {
      Api.ok(req, res, allForm)
    })
  }catch(error) {
      AppLogger.error("deletedForm", error);
      Api.invalid(req, res, {
        message: "Form getting Failed.",
      });
    }
  }
  public async downloadCSV(req, res): Promise<any> {
    try{
    const formServices = new FormService();
    const helper = new PostgresqlHelper();
    await formServices
    .getAllForms()
    .then((data) => {
      const fields = [
        {
          label: "form_id",
          value: (row, field) => decrypted(row[field.label]),
        },
        {
          label: "Form",
          value: "form",
        },
                   
      ];
      const FileDetails = {
        contentType: "text/csv",
        fileName: "Form.csv",
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
