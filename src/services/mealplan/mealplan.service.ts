import {
  AgeGroupDBModel,
  AllergenDBModel,
  DietaryDBModel,
  HighlyNutritionalDBModel,
  IngredientCategoryDBModel,
  IngredientDBModel,
  MealAgeGroupDBModel,
  MealDietaryDBModel,
  MealPlanBfDBModel,
  MealPlanDateDBModel,
  MealPlanDBModel,
  MealPlanDinnerDBModel,
  MealPlanEsDBModel,
  MealPlanLunchDBModel,
  MealPlanMsDBModel,
  MealTypeDBModel,
  NutritionCategoryDBModel,
  RecipeAgeGroupDBModel,
  RecipeDietaryDBModel,
  RecipeAltIngredientDBModel,
  RecipeCookMthdDBModel,
  RecipeImageDBModel,
  RecipeInfoDBModel,
  RecipeIngredientDBModel,
  RecipeTipsDBModel,
  RecipeEditDBModel,
  RecipeAllergenDBModel,
  RecipeIngredientListDBModel,
  MeasurementDBModel,
} from "../../db-models";
import {
  Op
} from "sequelize";
import model, {
  Model
} from "sequelize/types/model";
import {
  CookieMethodInterface,
  FilterBodyInterface,
  MealPlanInterface,
  RecipeAltIngredientInterface,
  RecipeCookMthdInterface,
  RecipeImageInterface,
  RecipeInfoInterface,
  RecipeIngredientInterface,
  RecipeTipsInterface,
  RequestBodyInterface,
  RequestCookingMthdInterface,
  RequestMealPlanInterface,
  RequestRecipeAltIngredientInterface,
  RequestRecipeIngredientInterface,
  RequestRecipeTipsInterface
} from "../../interface";
import {
  decrypted,
  encrypted,
  PostgresqlHelper,
  sequelize
} from "../../helper";
import moment from "moment";
import {
  eachDayOfInterval,
  format,
  parseISO
} from 'date-fns';
import {
  CollectionResultModel,
  MealPlanAddModel,
  RecipeAgeGroupModel,
  RecipeAltIngredientModel
} from "../../model";
import {
  Sequelize
} from "sequelize-typescript";
import { ADDRGETNETWORKPARAMS } from "dns";
import { removeDuplicates } from "../../lib";
import { NotificationService } from "..";
import * as fs from 'fs';
import * as PDFDocument from 'pdfkit';
import axios from 'axios';
import fetch from 'node-fetch';

export class MealPlanService {

  value: string;
  self = this;
  constructor() {
  }

  public async getMealPlanName(): Promise<any> {
    return await MealPlanDBModel.findAll({
      where: {
        status: 'active'
      }
    })
  }

  public async getInTrendImages(): Promise<any> {
    try {
      const inTrendImages = await MealPlanDBModel.findAll({
        where: {
          in_trend: true,
          status: 'active',
        },
        order: [['createdAt', 'DESC']],
      });
      return inTrendImages;
    } catch (error) {
      console.error('Error fetching in-trend meal plans with images:', error);
      throw error;
    }
  }

  public async getMealPlanByFilters(ageGroupId: number[], dietaryId: number[]): Promise<any> {
    try {
      let whereCondition = {};
      if (ageGroupId && dietaryId) {
        whereCondition = {
          '$age_group.age_group_id$': ageGroupId,
          '$dietary.dietary_id$': dietaryId,
          status: 'active',
        };
      } else if (ageGroupId) {
        whereCondition = {
          '$age_group.age_group_id$': ageGroupId,
          status: 'active',
        };
      } else if (dietaryId) {
        whereCondition = {
          '$dietary.dietary_id$': dietaryId,
          status: 'active'
        };
      }
      const mealPlans = await RecipeEditDBModel.findAll(
        {
          include: [
            {
              model: RecipeAgeGroupDBModel,
              include: [{ all: true, nested: true }],
            },
            {
              model: RecipeDietaryDBModel,
              include: [{ all: true, nested: true }],
            },
          ],
          where: whereCondition,
        });
      return mealPlans;
    } catch (err) {
      console.log(err);
      throw new Error('Failed to fetch meal plans');
    }
  }

  public async getMealPlan(
    requestBody: any
  ): Promise<any> {
    let whereCondition = {}
    if (requestBody['meal_plan_id']) {
      whereCondition = {
        meal_plan_id: typeof requestBody['meal_plan_id'] === 'number' ? requestBody['meal_plan_id'] : decrypted(requestBody['meal_plan_id'])
      }
    } else {
      whereCondition = {
        meal_plan_date: {
          [Op.between]: [requestBody.start_date, requestBody.end_date]
        }
      }
    }
    return await MealPlanDateDBModel.findAll({
      include: [{
        model: MealPlanDBModel,
        include: [{
          model: MealDietaryDBModel,
          include: [DietaryDBModel]
        },
        {
          model: MealAgeGroupDBModel,
          include: [AgeGroupDBModel]
        }]
      },
      {
        model: MealPlanBfDBModel,
        include: [
          {
            model: RecipeEditDBModel,
            include: [{
              model: RecipeImageDBModel
            },
            {
              model: RecipeDietaryDBModel,
              include: [DietaryDBModel]
            }
            ]
          }
        ]
      },
      {
        model: MealPlanEsDBModel,
        include: [
          {
            model: RecipeEditDBModel,
            include: [{
              model: RecipeImageDBModel
            },
            {
              model: RecipeDietaryDBModel,
              include: [DietaryDBModel]
            }
            ]
          }
        ]
      },
      {
        model: MealPlanLunchDBModel,
        include: [
          {
            model: RecipeEditDBModel,
            include: [{
              model: RecipeImageDBModel
            },
            {
              model: RecipeDietaryDBModel,
              include: [DietaryDBModel]
            }
            ]
          }
        ]
      },
      {
        model: MealPlanMsDBModel,
        include: [
          {
            model: RecipeEditDBModel,
            include: [{
              model: RecipeImageDBModel
            },
            {
              model: RecipeDietaryDBModel,
              include: [DietaryDBModel]
            }
            ]
          }
        ]
      },
      {
        model: MealPlanDinnerDBModel,
        include: [
          {
            model: RecipeEditDBModel,
            include: [{
              model: RecipeImageDBModel
            },
            {
              model: RecipeDietaryDBModel,
              include: [DietaryDBModel]
            }
            ]
          }
        ]
      }
      ],
      where: { ...whereCondition, status: 'active' },
      order: [['meal_plan_date', 'ASC'], ['meal_plan_id', 'ASC']]
    })
  }



  public async getFilteredMealPlanNames(ageGroup: number[], dietary: number[]): Promise<any> {
    try {
      const mealPlans = await MealPlanDBModel.findAll({
        attributes: ['meal_plan_id', 'meal_plan_name'],
        include: [
          {
            model: MealAgeGroupDBModel,
            where: {
              age_group_id: { [Op.in]: ageGroup },
            },
          },
          {
            model: MealDietaryDBModel,
            where: {
              dietary_id: { [Op.in]: dietary },
            },
          },
        ],
        raw: true,
      });
      const p = mealPlans.map(o => {
        const newO = {};
        Object.keys(o).slice(0, 2).forEach(key => {
          newO[key] = o[key]
        })
        return newO
      })
      return p;
    } catch (error) {

      console.error('Error fetching meal plan names:', error);
      throw error;
    }
  }


  public async getMealPlanByDate(mealPlanId: number, mealPlanDate: string): Promise<any> {
    const date = new Date(mealPlanDate)
    try {
      const whereCondition = {
        meal_plan_id: mealPlanId,
        meal_plan_date: date,
        status: 'active',
      };
      const mealPlanDetails = await MealPlanDateDBModel.findOne({
        where: whereCondition,
        include: [
          {
            model: MealPlanDBModel,
            include: [
              {
                model: MealDietaryDBModel,
                include: [DietaryDBModel],
              },
              {
                model: MealAgeGroupDBModel,
                include: [AgeGroupDBModel],
              },
            ],
          },
          {
            model: MealPlanBfDBModel,
            include: [
              {
                model: RecipeEditDBModel,
                include: [RecipeImageDBModel,
                  {
                    model: RecipeDietaryDBModel,
                    include:
                      [DietaryDBModel],
                  },
                  {
                    model: RecipeAllergenDBModel,
                    include:
                      [AllergenDBModel],
                  },
                ],
              },
            ],
          },
          {
            model: MealPlanEsDBModel,
            include: [
              {
                model: RecipeEditDBModel,
                include: [RecipeImageDBModel, {
                  model: RecipeDietaryDBModel,
                  include:
                    [DietaryDBModel],
                },
                  {
                    model: RecipeAllergenDBModel,
                    include:
                      [AllergenDBModel],
                  },],
              },
            ],
          },
          {
            model: MealPlanLunchDBModel,
            include: [
              {
                model: RecipeEditDBModel,
                include: [RecipeImageDBModel, {
                  model: RecipeDietaryDBModel,
                  include:
                    [DietaryDBModel],
                },
                  {
                    model: RecipeAllergenDBModel,
                    include:
                      [AllergenDBModel],
                  },],
              },
            ],
          },
          {
            model: MealPlanMsDBModel,
            include: [
              {
                model: RecipeEditDBModel,
                include: [RecipeImageDBModel, {
                  model: RecipeDietaryDBModel,
                  include:
                    [DietaryDBModel],
                },
                  {
                    model: RecipeAllergenDBModel,
                    include:
                      [AllergenDBModel],
                  },],
              },
            ],
          },
          {
            model: MealPlanDinnerDBModel,
            include: [
              {
                model: RecipeEditDBModel,
                include: [RecipeImageDBModel, {
                  model: RecipeDietaryDBModel,
                  include:
                    [DietaryDBModel],
                },
                  {
                    model: RecipeAllergenDBModel,
                    include:
                      [AllergenDBModel],
                  },],
              },
            ],
          },
        ],
      });
      return mealPlanDetails;
    } catch (error) {
      console.error('Error fetching meal plan details:', error);
      throw error;
    }
  }

  public async generatePDF(mealPlanDetails: any): Promise<Buffer> {
    const doc = new PDFDocument();
    const logoPath = 'src/assets/images/healthychamps_logo.png';
    const logoWidth = 100;  
    const logoHeight = 20;  
    const x = (doc.page.width - logoWidth) / 2;
    const y = 50;
    doc.image(logoPath, x, y, { width: logoWidth, height: logoHeight });
    doc.moveDown(2);
    doc.fontSize(20).text(`Meal Plan Details`, { align: 'center' });
    doc.moveDown(2);
    
    if (mealPlanDetails) {
      const mealPlanDate = new Date(mealPlanDetails.meal_plan_date);
      const month = mealPlanDate.toLocaleString('default', { month: 'long' });
      doc.fontSize(16).text(`Meal Plan Date: ${mealPlanDate.getDate()} ${month} ${mealPlanDate.getFullYear()}`);
      if (mealPlanDetails.meal_plan) {
        const mealPlan = mealPlanDetails.meal_plan;
        doc.fontSize(16).text(`Meal Plan Name: ${mealPlan.meal_plan_name}`);

        if (mealPlan.dietary && mealPlan.dietary.length > 0) {
          const dietaryList = mealPlan.dietary.map((item) => item.dietary_details.dietary).join(', ');
          doc.fontSize(14).text(`Dietary: ${dietaryList}`);
        }

        if (mealPlan.age_group && mealPlan.age_group.length > 0) {
          const ageGroupList = mealPlan.age_group.map((item) => item.age_group_details.age_group).join(', ');
          doc.fontSize(14).text(`Age Group: ${ageGroupList}`);
        }
        if (mealPlanDetails.breakFast && mealPlanDetails.breakFast.length > 0) {
          doc.fontSize(20).fillColor('red').text('Breakfast');
          const breakfastItems = mealPlanDetails.breakFast;
          breakfastItems.forEach((item) => {
            doc.fontSize(14).fillColor('red').text(`• Recipe Name: ${item.recipes.recipe_name}`);
            doc.fillColor('black').text(`Preparation Time: ${item.recipes.preparation_time}`);
            doc.fillColor('black').text(`Calories: ${item.recipes.calories}`);
            doc.fillColor('black').text(`Cooking Time: ${item.recipes.cooking_time}`);
            doc.fillColor('black').text(`Difficulty Level: ${item.recipes.difficulty_level}`);
            doc.fillColor('black').text(`Meal Type: ${item.recipes.meal_type}`);
            doc.fillColor('black').text(`No Of Serves: ${item.recipes.no_of_serves}`);
            doc.fillColor('black').text(`Meal Time: ${item.recipes.meal_time}`);
            
            if (item.recipes.dietary && item.recipes.dietary.length > 0) {
              const dietaryList = item.recipes.dietary.map((dietary) => dietary.dietary_details.dietary).join(', ');
              doc.text(`Dietary: ${dietaryList}`);
            }
            if (item.recipes.allergen && item.recipes.allergen.length > 0) {
              const allergenList = item.recipes.allergen.map((allergen) => allergen.allergen_details.allergen).join(', ');
              doc.text(`Allergen: ${allergenList}`);
            }
            if (item.recipes.recipe_images && item.recipes.recipe_images.length > 0) {
              const mainImageURL = item.recipes.recipe_images[0].recipe_main_image;
              const filename = mainImageURL.substring(mainImageURL.lastIndexOf('/') + 1);
              const logoPath = 'src/upload/recipe/images/'+filename;
              const logoWidth = 200; 
              const logoHeight = 100; 
              doc.image(logoPath, { width: logoWidth, height: logoHeight });
              doc.moveDown(2);
            }
          });
        } else {
          console.log("Breakfast data is not defined or empty.");
        }

        if (mealPlanDetails.eveningSnacks && mealPlanDetails.eveningSnacks.length > 0) {
          doc.fontSize(20).fillColor('red').text('Evening Snacks');
          const eveningSnackItems = mealPlanDetails.eveningSnacks;
          eveningSnackItems.forEach((item) => {
            doc.fontSize(14).fillColor('red').text(`• Recipe Name: ${item.recipes.recipe_name}`);
            doc.fillColor('black').text(`Preparation Time: ${item.recipes.preparation_time}`);
            doc.fillColor('black').text(`Calories: ${item.recipes.calories}`);
            doc.fillColor('black').text(`Cooking Time: ${item.recipes.cooking_time}`);
            doc.fillColor('black').text(`Difficulty Level: ${item.recipes.difficulty_level}`);
            doc.fillColor('black').text(`Meal Type: ${item.recipes.meal_type}`);
            doc.fillColor('black').text(`No Of Serves: ${item.recipes.no_of_serves}`);
            doc.fillColor('black').text(`Meal Time: ${item.recipes.meal_time}`);

            if (item.recipes.dietary && item.recipes.dietary.length > 0) {
              const dietaryList = item.recipes.dietary.map((dietary) => dietary.dietary_details.dietary).join(', ');
              doc.text(`Dietary: ${dietaryList}`);
            }
            if (item.recipes.allergen && item.recipes.allergen.length > 0) {
              const allergenList = item.recipes.allergen.map((allergen) => allergen.allergen_details.allergen).join(', ');
              doc.text(`Allergen: ${allergenList}`);
            }
            if (item.recipes.recipe_images && item.recipes.recipe_images.length > 0) {
              const mainImageURL = item.recipes.recipe_images[0].recipe_main_image;
              const filename = mainImageURL.substring(mainImageURL.lastIndexOf('/') + 1);
              const logoPath = 'src/upload/recipe/images/'+filename;
              const logoWidth = 200; 
              const logoHeight = 100; 
              doc.image(logoPath, { width: logoWidth, height: logoHeight });
              doc.moveDown(2);
            }
          });
        } else {
          console.log("Evening Snacks data is not defined or empty.");
        }
        if (mealPlanDetails.lunch && mealPlanDetails.lunch.length > 0) {
          doc.fontSize(20).fillColor('red').text('Lunch');
          const lunchItems = mealPlanDetails.lunch;
          lunchItems.forEach((item) => {
            doc.fontSize(14).fillColor('red').text(`• Recipe Name: ${item.recipes.recipe_name}`);
            doc.fillColor('black').text(`Preparation Time: ${item.recipes.preparation_time}`);
            doc.fillColor('black').text(`Calories: ${item.recipes.calories}`);
            doc.fillColor('black').text(`Cooking Time: ${item.recipes.cooking_time}`);
            doc.fillColor('black').text(`Difficulty Level: ${item.recipes.difficulty_level}`);
            doc.fillColor('black').text(`Meal Type: ${item.recipes.meal_type}`);
            doc.fillColor('black').text(`No Of Serves: ${item.recipes.no_of_serves}`);
            doc.fillColor('black').text(`Meal Time: ${item.recipes.meal_time}`);
            if (item.recipes.dietary && item.recipes.dietary.length > 0) {
              const dietaryList = item.recipes.dietary.map((dietary) => dietary.dietary_details.dietary).join(', ');
              doc.text(`Dietary: ${dietaryList}`);
            }
            if (item.recipes.allergen && item.recipes.allergen.length > 0) {
              const allergenList = item.recipes.allergen.map((allergen) => allergen.allergen_details.allergen).join(', ');
              doc.text(`Allergen: ${allergenList}`);
            }
            if (item.recipes.recipe_images && item.recipes.recipe_images.length > 0) {
              const mainImageURL = item.recipes.recipe_images[0].recipe_main_image;
              const filename = mainImageURL.substring(mainImageURL.lastIndexOf('/') + 1);
              const logoPath = 'src/upload/recipe/images/'+filename;
              const logoWidth = 200; 
              const logoHeight = 100; 
              doc.image(logoPath, { width: logoWidth, height: logoHeight });
              doc.moveDown(2);
            }
          });
        } else {
          console.log("Lunch data is not defined or empty.");
        }

        if (mealPlanDetails.morningSnacks && mealPlanDetails.morningSnacks.length > 0) {
          doc.fontSize(20).fillColor('red').text('Morning Snacks');
          const morningSnackItems = mealPlanDetails.morningSnacks;
          morningSnackItems.forEach((item) => {
            doc.fontSize(14).fillColor('red').text(`• Recipe Name: ${item.recipes.recipe_name}`);
            doc.fillColor('black').text(`Preparation Time: ${item.recipes.preparation_time}`);
            doc.fillColor('black').text(`Calories: ${item.recipes.calories}`);
            doc.fillColor('black').text(`Cooking Time: ${item.recipes.cooking_time}`);
            doc.fillColor('black').text(`Difficulty Level: ${item.recipes.difficulty_level}`);
            doc.fillColor('black').text(`Meal Type: ${item.recipes.meal_type}`);
            doc.fillColor('black').text(`No Of Serves: ${item.recipes.no_of_serves}`);
            doc.fillColor('black').text(`Meal Time: ${item.recipes.meal_time}`);

            if (item.recipes.dietary && item.recipes.dietary.length > 0) {
              const dietaryList = item.recipes.dietary.map((dietary) => dietary.dietary_details.dietary).join(', ');
              doc.text(`Dietary: ${dietaryList}`);
            }

            if (item.recipes.allergen && item.recipes.allergen.length > 0) {
              const allergenList = item.recipes.allergen.map((allergen) => allergen.allergen_details.allergen).join(', ');
              doc.text(`Allergen: ${allergenList}`);
            }
            if (item.recipes.recipe_images && item.recipes.recipe_images.length > 0) {
              const mainImageURL = item.recipes.recipe_images[0].recipe_main_image;
              console.log('Image URL:', mainImageURL);
              const filename = mainImageURL.substring(mainImageURL.lastIndexOf('/') + 1);
              const logoPath = 'src/upload/recipe/images/'+filename;
              const logoWidth = 200; 
              const logoHeight = 100; 
              doc.image(logoPath, { width: logoWidth, height: logoHeight });
              doc.moveDown(2);
            }
          });
        } else {
          console.log("Morning Snacks data is not defined or empty.");
        }

        if (mealPlanDetails.dinner && mealPlanDetails.dinner.length > 0) {
          doc.fontSize(20).fillColor('red').text('Dinner');
          const dinnerItems = mealPlanDetails.dinner;
          dinnerItems.forEach((item) => {
            doc.fontSize(14).fillColor('red').text(`• Recipe Name: ${item.recipes.recipe_name}`);
            doc.fillColor('black').text(`Preparation Time: ${item.recipes.preparation_time}`);
            doc.fillColor('black').text(`Calories: ${item.recipes.calories}`);
            doc.fillColor('black').text(`Cooking Time: ${item.recipes.cooking_time}`);
            doc.fillColor('black').text(`Difficulty Level: ${item.recipes.difficulty_level}`);
            doc.fillColor('black').text(`Meal Type: ${item.recipes.meal_type}`);
            doc.fillColor('black').text(`No Of Serves: ${item.recipes.no_of_serves}`);
            doc.fillColor('black').text(`Meal Time: ${item.recipes.meal_time}`);

            if (item.recipes.dietary && item.recipes.dietary.length > 0) {
              const dietaryList = item.recipes.dietary.map((dietary) => dietary.dietary_details.dietary).join(', ');
              doc.text(`Dietary: ${dietaryList}`);
            }
            if (item.recipes.allergen && item.recipes.allergen.length > 0) {
              const allergenList = item.recipes.allergen.map((allergen) => allergen.allergen_details.allergen).join(', ');
              doc.text(`Allergen: ${allergenList}`);
            }
            if (item.recipes.recipe_images && item.recipes.recipe_images.length > 0) {
              const mainImageURL = item.recipes.recipe_images[0].recipe_main_image;
              const filename = mainImageURL.substring(mainImageURL.lastIndexOf('/') + 1);
              const logoPath = 'src/upload/recipe/images/'+filename;
              const logoWidth = 200; 
              const logoHeight = 100; 
              doc.image(logoPath, { width: logoWidth, height: logoHeight });
              doc.moveDown(2);
            }
          });
        } else {
          console.log("Dinner data is not defined or empty.");
        }
        doc.end();
        return new Promise<Buffer>((resolve, reject) => {
          const buffers: Buffer[] = [];
          doc.on('data', (buffer) => buffers.push(buffer));
          doc.on('end', () => {
            const pdfBuffer = Buffer.concat(buffers);
            resolve(pdfBuffer);
          });
        });
      }
    }
  }

  public async getMealPlanSearch(requestBody: any): Promise<any> {
    let whereCondition = {};
    let wc = {};
    const { pageNumber, pageSize, search } = requestBody
    if (requestBody.startDate && requestBody.endDate) {
      const startDate = new Date(requestBody.startDate);
      const endDate = new Date(requestBody.endDate);
      wc = {
        meal_plan_date: { [Op.between]: [startDate, endDate] }
      }
    } else {
      wc = {}
    }

    if (search && search.searchText) {
      const searchText = search.searchText;
      whereCondition = {
        ...whereCondition,
        meal_plan_name: { [Op.iLike]: `%${searchText}%` }
      };
    }
    const meal_Plans = await MealPlanDateDBModel.findAndCountAll({
      where: { ...wc, status: 'active' },
      offset: pageNumber * pageSize,
      limit: pageSize,
      attributes: [],
      distinct: true,
      include: [
        {
          model: MealPlanDBModel,
          attributes: ['meal_plan_id', 'meal_plan_name', 'logo', 'description'],
          where: { ...whereCondition, status: 'active' }
        }
      ],
    });

    const uniqueMealPlans = removeDuplicates(meal_Plans.rows, 'meal_plan_id');

    return { count: uniqueMealPlans.length, rows: uniqueMealPlans }
  }


  public async getMealPlanByMonth(year: number): Promise<any> {
    try {
      const monthlyMealPlanCounts = await MealPlanDateDBModel.findAll({
        attributes: [
          [Sequelize.fn('TO_CHAR', Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('meal_plan_date')), 'Mon'), 'month'],
          [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('meal_plan_id'))), 'count']
        ],
        where: {
          status: 'active',
          meal_plan_date: {
            [Op.between]: [
              new Date(`${year}-01-01`),
              new Date(`${year}-12-31`)
            ]
          }
        },
        group: [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('meal_plan_date'))],
        order: [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('meal_plan_date'))]
      });

      return monthlyMealPlanCounts.map((result: any) => ({
        month: result.getDataValue('month').trim(),
        count: result.getDataValue('count')
      }));
    } catch (error) {
      throw error;
    }
  }

  public async addMealPlan(meal: RequestMealPlanInterface): Promise<any> {
    const covertPlayLoad = MealPlanAddModel.create(meal)
    covertPlayLoad['breakFast'] = [];
    covertPlayLoad['morningSnacks'] = [];
    covertPlayLoad['lunch'] = [];
    covertPlayLoad['eveningSnacks'] = [];
    covertPlayLoad['dinner'] = [];

    const b = await MealPlanDBModel.create({ ...covertPlayLoad }, {
      include: [
        {
          model: MealDietaryDBModel
        },
        {
          model: MealAgeGroupDBModel
        },
        {
          model: MealPlanDateDBModel,
          include: [
            {
              model: MealPlanBfDBModel,
            },
            {
              model: MealPlanMsDBModel
            },
            {
              model: MealPlanLunchDBModel
            },
            {
              model: MealPlanEsDBModel
            },
            {
              model: MealPlanDinnerDBModel
            }
          ]
        }
      ]

    });
    // (new NotificationService()).sendNotification({ id: b.dataValues.meal_plan_id, contentName: b.dataValues.meal_plan_name, moduleName: 'mealplan', route: 'MealPlanMain' })
    return b

  }

  public async editMealPlan(id): Promise<any> {
    return await MealPlanDBModel.findOne({
      where: {
        meal_plan_id: decrypted(id),
      },
    });
  }
  public async deleteMealPlan(requestBody: any): Promise<any> {
    const t = await sequelize.getSequelize.transaction();
    await MealPlanDBModel.findAll({
      where: { meal_plan_id: requestBody },
      transaction: t
    }).then((ingredient) => {
      ingredient.forEach(val => {
        val.status = 'inactive';
        val.save()
      })

    })
    await MealPlanDateDBModel.findAll({
      where: { meal_plan_id: requestBody },
      transaction: t
    }).then((ingredient) => {
      ingredient.forEach(val => {
        val.status = 'inactive';
        val.save()
      })

    })
    return await t.commit()
  }
  public async updateMealPlan(requestBody: any): Promise<any> {
    const meal_plan_id = parseInt(requestBody.meal_plan_id);
    return await MealPlanDBModel.findOne({
      where: { meal_plan_id: meal_plan_id }
    }).then(mealplanList => {
      mealplanList.meal_plan_name = requestBody.meal_plan_name;
      mealplanList.logo = requestBody.logo;
      mealplanList.description = requestBody.description;
      mealplanList.status = 'active';
      mealplanList.save();
      return 'Meal Plan is Updated successfully.'
    }).catch(error => {
      return 'Meal Plan Updated failed.!'
    });
  }

  public async findDatesBetween(start: string, end: string): Promise<string[]> {
    const dates: string[] = [];
    const startDate = parseISO(start);
    const endDate = parseISO(end);

    const days = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    days.forEach(day => {
      dates.push(format(day, 'yyyy-MM-dd'));
    });

    return dates;
  }

  public async mealPlanUniqueValidation(requestBody: any): Promise<any> {
    return await MealPlanDBModel.findOne({
      where: {
        $and: Sequelize.where(
          Sequelize.fn('lower', Sequelize.col('meal_plan_name')),
          Sequelize.fn('lower', requestBody.meal_plan_name)
        ),
        status: 'active',
        meal_plan_id: { [Op.ne]: requestBody.meal_plan_id }
      }
    })
  }
  public async getIngredientSwap(recipeInfoId: string): Promise<any> {
    const recipeId = parseInt(decrypted(recipeInfoId))
    try {
      const recipes = await RecipeEditDBModel.findAll({
        where: { recipe_info_id: recipeId },
        include: [
          {
            model: RecipeIngredientListDBModel,
            required: false,
            include: [
              {
                model: IngredientCategoryDBModel,
                required: true,
              },
              {
                model: MeasurementDBModel,
                required: true,
              },
              {
                model: RecipeAltIngredientDBModel,
                required: false,
                include: [
                  {
                    model: IngredientCategoryDBModel,
                    required: true,
                  },
                  {
                    model: MeasurementDBModel,
                    required: true,
                  },
                ],
              },
            ],
          },
        ],
      });

      if (!recipes || recipes.length === 0) {
        console.error('Recipe not found.');
        return null;
      }

      const result = [];

      for (const recipe of recipes) {
        for (const ingredientList of recipe.recipe_ingredient) {
          if (ingredientList.alternateIngredient && ingredientList.alternateIngredient.length > 0) {
            const AlternativeIngredients = ingredientList.alternateIngredient.map((altIngredient) => ({
              alt_ing_id: altIngredient.alt_ing_id,
              recipe_ing_id: altIngredient.recipe_ing_id,
              ing_category_id: altIngredient.ing_category_id,
              quantity: altIngredient.quantity,
              measurement_id: altIngredient.measurement_id,
              ingredient_category: altIngredient.ingredient_category,
              measurement_name: altIngredient.measurement_name,
            }));

            result.push({
              recipe_ing_id: ingredientList.recipe_ing_id,
              recipe_info_id: ingredientList.recipe_info_id,
              ing_category_id: ingredientList.ing_category_id,
              quantity: ingredientList.quantity,
              measurement_id: ingredientList.measurement_id,
              ingredient_category: ingredientList.ingredient_category?.ingredient_category,
              measurement_name: ingredientList.measurement_name?.measurement_name,
              alternateIngredient: AlternativeIngredients,
            });
          }
        }
      }

      if (result.length === 0) {
        console.log('No alternative ingredients found.');
        return null;
      }

      return result;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }



  public async mealPlanDateUniqueValidation(requestBody: any): Promise<any> {
    return await MealPlanDateDBModel.findOne({
      where: {
        meal_plan_date: requestBody.meal_plan_date,
        mealplan_date_id: { [Op.ne]: requestBody.meal_plan_id }
      }
    })
  }

  public async addUpdateBreakfast(requestBody: any): Promise<any> {
    await MealPlanBfDBModel.destroy({
      where: {
        mealplan_date_id: requestBody[0].mealplan_date_id
      }
    })

    return MealPlanBfDBModel.bulkCreate(requestBody);
  }

  public async addUpdateMorningSnacks(requestBody: any): Promise<any> {
    await MealPlanMsDBModel.destroy({
      where: {
        mealplan_date_id: requestBody[0].mealplan_date_id
      }
    })

    return MealPlanMsDBModel.bulkCreate(requestBody);
  }

  public async addUpdateLunch(requestBody: any): Promise<any> {
    await MealPlanLunchDBModel.destroy({
      where: {
        mealplan_date_id: requestBody[0].mealplan_date_id
      }
    })

    return MealPlanLunchDBModel.bulkCreate(requestBody);

  }

  public async addUpdateEveningSnacks(requestBody: any): Promise<any> {
    await MealPlanEsDBModel.destroy({
      where: {
        mealplan_date_id: requestBody[0].mealplan_date_id
      }
    })

    return MealPlanEsDBModel.bulkCreate(requestBody);
  }

  public async addUpdateDinner(requestBody: any): Promise<any> {
    await MealPlanDinnerDBModel.destroy({
      where: {
        mealplan_date_id: requestBody[0].mealplan_date_id
      }
    })

    return MealPlanDinnerDBModel.bulkCreate(requestBody);
  }

  public async getAllMealPlans() {
    const mealplanNames = await this.getMealPlanName();
    const mealPlanIds = mealplanNames.map((name) => name.meal_plan_id);
    const mealPlans = await Promise.all(mealPlanIds.map((id) => this.getMealPlan({ "meal_plan_id": id })));
    return mealPlans;
  }

  public async countInTrendMealPlans(sd, ed): Promise<any> {
    const count = await MealPlanDBModel.findAll({
      where: {
        in_trend: true,
        createdAt: {
          [Op.between]: [sd, ed]
        },
        status: 'active'
      }
    });
    const counting = count.length;
    return counting;
  }

  public async getMealForReplicate(mealId: any): Promise<any> {
    const p = await MealPlanDateDBModel.findAll({
      attributes: ['meal_plan_date'],
      where: {
        meal_plan_id: mealId.meal_id,
      },
      order: [['mealplan_date_id', 'ASC']]
    })

    return await this.getMealPlan({ start_date: p[0].meal_plan_date, end_date: p[6].meal_plan_date, meal_plan_id: mealId.meal_id })
  }
}



