
import { Router } from "express";
import { Api, decrypted, PostgresqlHelper } from "../helper";
import { FoodCategoryService } from "../services";
import { AppRoute } from "../app-route";
import AppLogger from "../helper/app-logger";

    export class FoodCategoryController implements AppRoute {
        route: string = '/food-category';
        router: Router = Router();
    
        constructor() {
            this.router.post('/get-food-category', this.getFoodCategory);
            this.router.post('/add-food-category', this.addFoodCategory);
            this.router.put('/delete-food-category', this.deleteFoodCat);
            this.router.put('/update-food-category', this.updateFoodCat);
            this.router.get('/allFoodcat', this.getAllFoodCat);
            this.router.get('/downloadfoodcategory', this.downloadCSV)
        }
        
    
        public async getFoodCategory(req, res): Promise<any> {
            try{
            const foodCategoryServices = new FoodCategoryService();
            await foodCategoryServices.getFoodCategoryList(req.body)
            .then((foodCategoryList) => {
             Api.ok(req, res, foodCategoryList)
           })
          }catch(error){
                AppLogger.error('getFoodCategory', error)
                Api.invalid(req, res,  {message: 'Food category list Failed.'})
            }
        }

        public async addFoodCategory(req, res): Promise<any> {
          try{
            const foodcategoryServices = new FoodCategoryService();
            await foodcategoryServices.addFoodCategory(req.body)
                .then((foodCategoryList) => {
                    Api.ok(req, res, { message: 'Food category added successfully.' })
                })
              }catch(error){
                    AppLogger.error('addFoodCategory', error)
                    if(error.name === 'SequelizeValidationError') {
                        Api.invalid(req, res, {
                          message: error.errors[0].message
                        })
                      } else {
                        Api.badRequest(req, res, { message: 'Food category add Failed.' })
                      }
                }
              }


        public async deleteFoodCat(req, res): Promise<any> {
          try{
            const foodCategoryServices = new FoodCategoryService();
            await foodCategoryServices.deleteFoodCat(req.body.id)
            .then((foodCategoryList) => {
                Api.ok(req, res, {message: 'Food category deleted successfully.'})
            })
          }catch(error){
                AppLogger.error('deletedFoodCategory', error)
                Api.invalid(req, res,  {message: 'Food category deleted Failed.'})
            }  
        }

         public async getAllFoodCat(req, res): Promise<any>{
         try{
         const foodCategoryServices = new FoodCategoryService();
         await foodCategoryServices.getFoodCat().then((allfoodcat) => {
        Api.ok(req, res, allfoodcat)
    })
     }catch(error){
        AppLogger.error('getAllFoodCat', error)
    }
}

  public async updateFoodCat(req, res): Promise<any> {
  try{
    const foodCategoryServices = new FoodCategoryService();
    await foodCategoryServices
      .updateFoodCat(req.body)
      .then((foodcatList) => {
        Api.ok(req, res, {
          message: "Food Category updated successfully.",
        });
      })
    }catch(error){
        AppLogger.error("deletedFoodCat", error);
        Api.invalid(req, res, {
          message: "Food Category updated Failed.",
        });
      }
  }

   public async downloadCSV(req, res): Promise<any> {
    try{
    const foodCategoryServices = new FoodCategoryService();
    const helper = new PostgresqlHelper();
    await foodCategoryServices
    .getAllFoodCategories()
    .then((data) => {
      const fields = [
        {
          label: "food_category_id",
          value: (row, field) => decrypted(row[field.label]),
        },
        {
          label: "Food Category",
          value: "food_category",
        },
                   
      ];
      const FileDetails = {
        contentType: "text/csv",
        fileName: "Food Category.csv",
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

