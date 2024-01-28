import { Router } from "express";
import { Api, decrypted, PostgresqlHelper } from "../helper";
import { SupplierService } from "../services";
import { AppRoute } from "../app-route";
import AppLogger from "../helper/app-logger";


export class SupplierController implements AppRoute {
    route: string = '/supplier';
    router: Router = Router();

    constructor() {
        this.router.post('/get-supplier', this.getSupplier);
        this.router.post('/add-supplier', this.addSupplier);
        this.router.put('/delete-supplier', this.deleteSupplier);
        this.router.get('/allsupplier', this.getAllSupplier);
        this.router.put('/update-supplier', this.updateSupplier);
        this.router.get('/download-supplier', this.downloadCSV);
    }
    

    public async getSupplier(req, res): Promise<any> {
      try{
        const supplierServices = new SupplierService();
        await supplierServices.getSupplierList(req.body)
        .then((supplierList) => {
         Api.ok(req, res, supplierList)
       })}
       catch(error) {
            AppLogger.error('getSupplier', error)
            Api.invalid(req, res,  {message: 'Supplier list Failed.'})
        }
    }

    public async addSupplier(req, res):  Promise<any> {
      try{
        const supplierServices = new SupplierService();
        await supplierServices.addSupplier(req.body)
        .then((supplierList) => {
            Api.ok(req, res, {message: 'Supplier add successfully.'})
        })}
        catch(error){
            AppLogger.error('addSupplier', error)
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

    public async deleteSupplier(req, res): Promise<any> {
      try{
        const supplierServices = new SupplierService();
        await supplierServices.deleteSupplier(req.body.id)
        .then((supplierList) => {
            Api.ok(req, res, {message: 'Supplier deleted successfully.'})
        })}
        catch(error){
            AppLogger.error('deletedSupplier', error)
            Api.invalid(req, res,  { message: 'Supplier deleted Failed.'})
        } 
  }

public async getAllSupplier(req, res): Promise<any>{
    try{
    const supplierServices = new SupplierService();
    await supplierServices.getSupplier().then((allsupplier) => {
        Api.ok(req, res, allsupplier)
    })
  }catch(error) {
        AppLogger.error('getAllSupplier', error)

    }
}

public async updateSupplier(req, res): Promise<any> {
  try{
    const mealTypeServices = new SupplierService();
    await mealTypeServices
      .updateSupplier(req.body)
      .then((mealTypeList) => {
        Api.ok(req, res, {
          message: "Supplier update successfully.",
        });
      })
    }catch(error){
        AppLogger.error("deleted Supplier", error);
        Api.invalid(req, res, {
          message: "Supplier update Failed.",
        });
      }
  }

  public async downloadCSV(req, res): Promise<any> {
    try{
    const supplierServices = new SupplierService();
    const helper = new PostgresqlHelper();
    await supplierServices
    .getAllSupplier()
    .then((data) => {
      const fields = [
        {
          label: "supplier_id",
          value: (row, field) => decrypted(row[field.label]),
        },
        {
          label: "Supplier",
          value: "supplier",
        },
                   
      ];
      const FileDetails = {
        contentType: "text/csv",
        fileName: "Supplier.csv",
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

