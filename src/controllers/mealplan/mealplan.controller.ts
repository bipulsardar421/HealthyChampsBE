import { Router, Request, Response } from "express";
import { MealPlanService, RecipeInfoService } from "../../services";
import { AppRoute } from "../../app-route";
import AppLogger from "../../helper/app-logger";
import { Api, decrypted } from "../../helper";
import { MealPlanCollectionsDataModel } from "../../model";
import { Json } from "sequelize/types/utils";
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import * as PDFDocument from 'pdfkit';
import {  rgb } from 'pdf-lib';


export class MealPlanController implements AppRoute {
  route = "/meal_plan_main";
  router: Router = Router();

  private readonly DIR = './src/upload/mealplan/images';
  private readonly strorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, this.DIR)
    },
    filename: (req, file, cb) => {
      const fileName = file.fieldname.toLocaleLowerCase().split(' ').join('-') + '-' + Date.now() + path.extname(file.originalname);
      console.log(fileName)
      cb(null, fileName)
    }
  });
  private readonly upload = multer({
    storage: this.strorage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
    }
  })

  constructor() {
    this.router.post("/getMealPlan", this.getMealPlan);
    this.router.post("/getMealPlanSearch", this.getMealPlanSearch);
    this.router.post("/addMealPlan", this.addMealPlan);
    this.router.put("/deleteMealPlan", this.deleteMealPlan);
    this.router.put("/updateMealPlan", this.updateMealPlan);
    this.router.post("/findDatesBetween", this.findDatesBetween);
    this.router.post("/uniqueMealPlan", this.uniqueMealPlan);
    this.router.post("/uniqueMealPlanDate", this.uniqueMealPlanDate);
    this.router.get("/editMealPlan/:id", this.editMealPlan);
    this.router.get("/getBannerImage", this.getInTrendImages);

    this.router.get("/getMealPlanName", this.getMealPlanName);
    this.router.post("/getfilterMealPlan", this.getMealPlanByFilters);

    this.router.post("/meal-breakfast", this.addUpdateBreakfast);
    this.router.post("/meal-morning-snacks", this.addUpdateMorningSnacks);
    this.router.post("/meal-lunch", this.addUpdateLunch);
    this.router.post("/meal-evening-snack", this.addUpdateEveningSnacks);
    this.router.post("/meal-dinner", this.addUpdateDinner);
    
    this.router.get("/getAllMealPlan", this.getAllMealPlans);
    this.router.post("/getMealPlanDetails", this.getMealPlanDetails);
    this.router.post("/getTrendingMealplan", this.getInTrendMealPlan);
    this.router.post("/getMealPlanByDate", this.getMealPlanByDate);
    this.router.post("/uploadImage", this.upload.array('mealplanlogo', 1), this.uploadImage);
  
    this.router.post("/downloadMealPlan", this.downloadMealPlanMobile);
    this.router.post("/getIngredientSwap", this.getIngredientSwap);
    this.router.post("/getFilteredMealPlan", this.getFilterMealPlan);
    this.router.post("/getMealForReplicate", this.getMealForReplicate);


    this.router.delete("/deleteLogo/:imageName", this.deleteLogo);
  //  this.router.get('/download', this.downloadPdf);

  }



  public async downloadMealPlanMobile(req, res): Promise<any> {
    console.log('bgdg', req.body);
    try {
      const { mealPlanId, mealPlanDate } = req.body;
      const _mealplanService = new MealPlanService();
      const mealPlanDetails = await _mealplanService.getMealPlanByDate(mealPlanId, mealPlanDate);
  
      const mealplans = await _mealplanService.generatePDF(mealPlanDetails);
      console.log(mealplans.toString('base64'));
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="mealplan.pdf"`);
      res.send(mealplans);
    } catch (error) {
      console.error('Error in downloadMealPlanMobile:', error);
      res.status(500).json({ error: 'Failed to download meal plan' });
    }
  }
  
    

  public async deleteLogo(req: Request, res: Response): Promise<void> {
    const imageName = req.params.imageName;
    try {
      fs.unlink(`./src/upload/mealplan/images/${imageName}`, (err) => {
        if (err) {
          console.error(err);
          return Api.badRequest(req, res, { message: `${imageName} is not deleted` });
        }
        Api.ok(req, res, { message: `Deleted ${imageName} is successfully.` });
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  }

  public uploadImage(req, res, next) {
    console.log('Hello Images Coming', req.files[0].filename)
    const imageName = req.files[0].filename;
    res.json({ imageName })
  }


  public async getInTrendMealPlan(req: any, res: any): Promise<any> {
    const { sd, ed } = req.body;
    try {
      const _mealplanService = new MealPlanService();
      const count = await _mealplanService.countInTrendMealPlans(sd, ed);
      res.status(200).json({ count });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async getInTrendImages(req: any, res: any): Promise<any> {
    try {
      const _mealplanService = new MealPlanService();
      const inTrend = await _mealplanService.getInTrendImages();
      return res.json(inTrend)
    } catch (error) {
      console.error('Error fetching in-trend meal plans with images:', error);
      return res.status(500).json({ error: 'An error occurred' });
    }
  }

  public async getFilterMealPlan(req: any, res: any): Promise<any> {
    try {
      const _mealplanService = new MealPlanService();
      const { age_group, dietary } = req.body;
      const mealPlanNames = await _mealplanService.getFilteredMealPlanNames(age_group, dietary);
      res.status(200).json(mealPlanNames);
    } catch (error) {
      console.error('Error fetching meal plan names:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async getMealPlanDetails(req: any, res: any): Promise<any> {
    console.log(req.body.year);
    try {
      const mealPlanService = new MealPlanService();
      const mealPlanDetails = await mealPlanService.getMealPlanByMonth(req.body.year);
      const monthsList = Array.from({ length: 12 }, (_, monthIndex) => {
        const date = new Date(0, monthIndex);
        return date.toLocaleString('en-US', { month: 'short' });
      });
      const monthlyCountsMap = new Map<string, number>();
      for (const { month, count } of mealPlanDetails) {
        monthlyCountsMap.set(month, count);
      }
      const result = monthsList.map(month => ({
        month,
        count: monthlyCountsMap.get(month) || 0
      }));

      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }


  public async getAllMealPlans(req: any, res: any): Promise<any> {
    try {
      const _mealplanService = new MealPlanService();
      const mealPlanNameList = await _mealplanService.getAllMealPlans();
      Api.ok(req, res, mealPlanNameList);
    } catch (err) {
      console.log(err);
    }
  }

  public async addUpdateBreakfast(req: any, res: any): Promise<any> {
    try {
      const _mealplanService = new MealPlanService();
      _mealplanService.addUpdateBreakfast(req.body)
        .then(data => {
          Api.ok(req, res, { message: 'Success' })
        }).catch(error => Api.invalid(req, res, { message: 'invalid data' }))

    } catch (err) {
      Api.badRequest(req, res, { message: 'Failed' })
    }
  }

  public async addUpdateMorningSnacks(req: any, res: any): Promise<any> {
    try {
      const _mealplanService = new MealPlanService();
      _mealplanService.addUpdateMorningSnacks(req.body)
        .then(data => {
          Api.ok(req, res, { message: 'Success' })
        }).catch(error => Api.invalid(req, res, { message: 'invalid data' }))

    } catch (err) {
      Api.badRequest(req, res, { message: 'Failed' })
    }
  }

  public async addUpdateLunch(req: any, res: any): Promise<any> {
    try {
      const _mealplanService = new MealPlanService();
      _mealplanService.addUpdateLunch(req.body)
        .then(data => {
          Api.ok(req, res, { message: 'Success' })
        }).catch(error => Api.invalid(req, res, { message: 'invalid data' }))

    } catch (err) {
      Api.badRequest(req, res, { message: 'Failed' })
    }
  }

  public async addUpdateEveningSnacks(req: any, res: any): Promise<any> {
    try {
      const _mealplanService = new MealPlanService();
      _mealplanService.addUpdateEveningSnacks(req.body)
        .then(data => {
          Api.ok(req, res, { message: 'Success' })
        }).catch(error => Api.invalid(req, res, { message: 'invalid data' }))

    } catch (err) {
      Api.badRequest(req, res, { message: 'Failed' })
    }
  }

  public async addUpdateDinner(req: any, res: any): Promise<any> {
    try {
      const _mealplanService = new MealPlanService();
      _mealplanService.addUpdateDinner(req.body)
        .then(data => {
          Api.ok(req, res, { message: 'Success' })
        }).catch(error => Api.invalid(req, res, { message: 'invalid data' }))

    } catch (err) {
      Api.badRequest(req, res, { message: 'Failed' })
    }
  }

  public async getMealPlanName(req: any, res: any): Promise<any> {
    try {
      const _mealplanService = new MealPlanService();
      _mealplanService.getMealPlanName()
        .then((mealPlanNameList) => {
          Api.ok(req, res, mealPlanNameList);
        })
    } catch (err) {
      console.log(err)
    }
  }

  public async getMealPlanByDate(req: any, res: any): Promise<any> {
    try {
      const _mealplanService = new MealPlanService();
      const { mealPlanId, mealPlanDate } = req.body;
      const mealPlanDetails = await _mealplanService.getMealPlanByDate(mealPlanId, mealPlanDate);
      if (!mealPlanDetails) {
        return res.status(404).json({ error: 'Meal plan not found or not active.' });
      }
      return res.json(mealPlanDetails);
      
    } catch (error) {
      console.error('Error fetching meal plan details:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }

  }


  public async getIngredientSwap(req: any, res: any): Promise<void> {
    try {
      const _mealplanService = new MealPlanService();
      const { recipeInfoId } = req.body
      const Ingredients = await _mealplanService.getIngredientSwap(recipeInfoId);
      if (Ingredients) {
        res.status(200).json({ Ingredients });
      } else {
        res.status(404).json({ message: 'No alternative ingredients found.' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }


  public async getMealPlanByFilters(req: any, res: any) {
    try {
      const _mealplanService = new MealPlanService();
      const ageGroupId = (req.body.age_group);
      const dietaryId = (req.body.dietary);
      const mealPlans = await _mealplanService.getMealPlanByFilters(ageGroupId, dietaryId);
      return res.status(200).json(mealPlans);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  public async uniqueMealPlan(req: any, res: any): Promise<any> {
    const _mealplanService = new MealPlanService();
    await _mealplanService.mealPlanUniqueValidation(req.body)
      .then((data) => {
        return res.jsonp(data);
      });

  }

  public async uniqueMealPlanDate(req: any, res: any): Promise<any> {
    const _mealplanService = new MealPlanService();
    await _mealplanService.mealPlanDateUniqueValidation(req.body)
      .then((data) => {
        return res.jsonp(data);
      });

  }
  public async getMealPlanSearch(req: any, res: any): Promise<any> {
    try {
      const mealPlanService = new MealPlanService();
      const mealPlans = await mealPlanService.getMealPlanSearch(req.body);
      res.json(mealPlans);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
      res.status(500).json({ error: 'An error occurred while fetching meal plans' });
    }
  }

  public async getMealPlan(req: any, res: any): Promise<any> {
    try {
      const _mealplanService = new MealPlanService();
      await _mealplanService
        .getMealPlan(req.body)
        .then((data) => {
          if (data.length) {
            if (req.body.hasOwnProperty('meal_plan_id')) {
              _mealplanService.getMealPlan({ start_date: req.body.start_date, end_date: req.body.end_date }).then((datas) => {
                const val = MealPlanCollectionsDataModel.create(data, datas);
                return res.jsonp(val)
              })
            } else {
              const val = MealPlanCollectionsDataModel.create(data);
              return res.jsonp(val);
            }

          } else {
            return res.jsonp(data);
          }

        });
    } catch (err) {

      console.log(err)
    }

  }

  public async findDatesBetween(req: any, res: any): Promise<any> {
    const _mealplanService = new MealPlanService();
    const { startDate, endDate } = req.query;
    const dates =
      await _mealplanService.findDatesBetween(startDate, endDate);
    return res.jsonp(dates);
  }

  public async addMealPlan(req: any, res: any): Promise<any> {
    const _mealplanService = new MealPlanService();
    await _mealplanService.addMealPlan(req.body)
      .then((mealplanId) => {
        Api.ok(req, res, {
          message: 'Success',
          meal: mealplanId['dataValues']
        })
      })
      .catch(error => {
        console.log(error)
        AppLogger.error('MealPlan add', error)
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

  public async editMealPlan(req: any, res: any): Promise<any> {
    const _mealplanService = new MealPlanService();
    const getMealPlanList = await _mealplanService
      .editMealPlan(req.params.id)
      .then((data) => {
        return res.jsonp(data);
      });
  }

  public async deleteMealPlan(req, res): Promise<any> {
    const _mealplanService = new MealPlanService();
    await _mealplanService
      .deleteMealPlan(req.body.meal_plan_id)
      .then((mealplanList) => {
        Api.ok(req, res, {
          message: "MealPlan deleted successfully.",
        });
      })
      .catch((error) => {
        AppLogger.error("deletedMealPlan", error);
        Api.invalid(req, res, {
          message: "MealPlan deleted Failed.",
        });
      });
  }

  public async updateMealPlan(req, res): Promise<any> {
    const _mealplanService = new MealPlanService();
    await _mealplanService
      .updateMealPlan(req.body)
      .then((mealplanList) => {
        Api.ok(req, res, {
          message: "MealPlan Name updated successfully",
        });
      })
      .catch((error) => {
        console.log(error)
        AppLogger.error("Updated MealPlan", error);
        Api.invalid(req, res, {
          message: "MealPlan Name updated Failed.",
        });
      });
  }


  public async getMealForReplicate(req: any, res: any): Promise<any> {
    const data = await (new MealPlanService()).getMealForReplicate(req.body)
    res.json(MealPlanCollectionsDataModel.create(data))
  }


  // public async downloadPdf() {
  //   (<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
  //   const documentDefinition = {
  //     content: [
  //       {
  //         text: 'MealPlan Info',
  //         style: 'header',
  //       },
  //    ] }
  //    const pdfDocGenerator = pdfMake.createPdf(documentDefinition as any);
  //    pdfDocGenerator.download('mealplan.pdf');
  //   }
  }
