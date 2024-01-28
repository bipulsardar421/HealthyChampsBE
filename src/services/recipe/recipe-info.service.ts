import {
  AgeGroupDBModel,
  AllergenDBModel,
  DietaryDBModel,
  HighlyNutritionalDBModel,
  RecipeIngredientListDBModel,
  IngredientCategoryDBModel,
  IngredientDBModel,
  MealTypeDBModel,
  NutritionCategoryDBModel,
  RecipeAltIngredientDBModel,
  RecipeCookMthdDBModel,
  RecipeImageDBModel,
  RecipeInfoDBModel,
  RecipeIngredientDBModel,
  RecipeTipsDBModel,
  RecipeVideoDBModel,
  RecipeEditDBModel,
  RecipeViewDBModel,
  RecipeDietaryDBModel,
  RecipeAllergenDBModel,
  RecipeHighlyNutriDBModel,
  RecipeAgeGroupDBModel,
  RecipeNutritionalCatDBModel,
  MeasurementDBModel,
  FormDBModel,
} from "../../db-models";
import {
  Op,
  where
} from "sequelize";
import model,
{ Model } from "sequelize/types/model";
import {
  CookieMethodInterface,
  FilterBodyInterface,
  RecipeAltIngredientInterface,
  RecipeCookMthdInterface,
  RecipeImageInterface,
  RecipeInfoInterface,
  RecipeIngredientInterface,
  RecipeIntergrentAltInterface,
  RecipeTipsInterface,
  RecipeVideoInterface,
  RequestBodyInterface,
  RequestCookingMthdInterface,
  RequestRecipeAltIngredientInterface,
  RequestRecipeInfoInterface,
  RequestRecipeIngredientInterface,
  RequestRecipeTipsInterface
} from "../../interface";
import {
  decrypted,
  encrypted,
  PostgresqlHelper,
  sequelize
} from "../../helper";
import {
  CollectionResultModel,
  RecipeAddModel,
  RecipeAgeGroupEditModel,
  RecipeAllergenEditModel,
  RecipeDietaryEditModel,
  RecipeDietaryModel,
  RecipeHighlyNutriEditModel,
  RecipeIngredientModel,
  RecipeNutritionalCatEditModel
} from "../../model";
import {
  getRandomValues
} from "crypto";
import { Sequelize } from "sequelize-typescript";
import { RatingsReviewService } from "../ratings-review.service";
import { any } from "nconf";
import { NotificationService } from "../notification.service";




interface RequestCookingMthd {
  cooking_method: string
}

export class RecipeInfoService {
  private ratingsReviewService: RatingsReviewService;

  value: string;
  self = this;
  constructor() {
    this.ratingsReviewService = new RatingsReviewService();
  }


  public async getRecipeInfo(requestBody: Partial<RequestBodyInterface>): Promise<any> {
    try {
      const { data, type } = requestBody.filterFields ?? { data: {}, type: '' };
      console.log(data, type);

      const typeToWhereCondition = {
        nutritionRich: {
          nutrition_rich: true,
        },
        recipeCount: {},
        mostlyLiked: {
          mostly_liked: true,
        },
        mostlyConsumed: {
          mostly_consumed: true,
        },
      };

      const getWhereCondition = (type, data) => {
        const baseCondition = {
          createdAt: {
            [Op.between]: [data.start_date, data.end_date],
          },
        };
        return { ...baseCondition, ...(typeToWhereCondition[type] || {}) };
      };

      let whereCondition = {};

      if (type && Object.keys(typeToWhereCondition).includes(type)) {
        whereCondition = getWhereCondition(type, data);
        console.log(whereCondition);
      }

      const searchColumn = {
        'recipe_name': 'recipe_name',
        'preparation_time': 'preparation_time',
        'cooking_time': 'cooking_time',
        'calories': 'calories',
        'meal_time': 'meal_time',
      };

      const sortColumn = { ...searchColumn };

      const postresSqlHelper = new PostgresqlHelper();
      const getQueryData = postresSqlHelper.tableListQuery(
        searchColumn,
        requestBody,
        RecipeInfoDBModel,
        sortColumn,
        whereCondition
      );
      const recipe = await RecipeInfoDBModel.findAndCountAll(getQueryData);
      return new CollectionResultModel(recipe, requestBody);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async viewAllRecipeInfo(id?: string): Promise<any> {
    console.log(id, parseInt(decrypted(id)))
    return await RecipeEditDBModel.findOne({
      include: [
        {
          model: RecipeDietaryDBModel,
          include: [DietaryDBModel]
        },
        {
          model: RecipeAllergenDBModel,
          include: [AllergenDBModel]
        },
        {
          model: RecipeHighlyNutriDBModel,
          include: [HighlyNutritionalDBModel]
        },
        {
          model: RecipeAgeGroupDBModel,
          include: [AgeGroupDBModel]
        },
        {
          model: RecipeNutritionalCatDBModel,
          include: [NutritionCategoryDBModel]
        },
        {
          model: RecipeIngredientListDBModel, required: false,
          include: [{
            model: IngredientCategoryDBModel,
            required: true
          },
          {
            model: MeasurementDBModel,
            required: true
          },
          {
            model: FormDBModel,
            required: true
          },
          { model: IngredientDBModel, required: false },
          {
            model: RecipeAltIngredientDBModel,
            required: false,
            include: [{
              model: IngredientCategoryDBModel,
              required: true,
            },
            {
              model: MeasurementDBModel,
              required: true,
            },
            ],
          }]
        },
        { model: RecipeCookMthdDBModel },
        { model: RecipeTipsDBModel },
        { model: RecipeImageDBModel },
        { model: RecipeVideoDBModel },

      ], where: {
        recipe_info_id: parseInt(decrypted(id)),
      },
    });
  }

  public async addRecipeInfo(receipe: RequestRecipeInfoInterface): Promise<any> {
    const covertPlayLoad = RecipeAddModel.create(receipe)
    const b = await RecipeInfoDBModel.create({ ...covertPlayLoad }, {
      include: [
        RecipeDietaryDBModel,
        RecipeAllergenDBModel,
        RecipeHighlyNutriDBModel,
        RecipeAgeGroupDBModel,
        RecipeNutritionalCatDBModel
      ]

    });
    (new NotificationService()).sendNotification({ id: b.dataValues.recipe_info_id, contentName: b.dataValues.recipe_name, moduleName:'Recipe', route:'Recipe' })
    return b;
  }

  public async updateRecipeInfo(requestBody: any): Promise<any> {
    const recipe_info_id = parseInt(decrypted(requestBody.recipe_info_id));
    const t = await sequelize.getSequelize.transaction();
    const dietary = requestBody.dietary.map(list => RecipeDietaryEditModel.create(list, recipe_info_id));
    const ageGrop = requestBody.age_group.map(list => RecipeAgeGroupEditModel.create(list, recipe_info_id));
    const highyNutritional = requestBody.highly_nutritional.map(list => RecipeHighlyNutriEditModel.create(list, recipe_info_id));
    const nutritionalCategory = requestBody.nutrition_category.map(list => RecipeNutritionalCatEditModel.create(list, recipe_info_id));
    const allergen = requestBody.allergen.map(list => RecipeAllergenEditModel.create(list, recipe_info_id));
    try {
      const result = await Promise.all([
        RecipeInfoDBModel.update({
          recipe_info_id: requestBody.recipe_info_id,
          recipe_name: requestBody.recipe_name,
          preparation_time: requestBody.preparation_time,
          cooking_time: requestBody.cooking_time,
          calories: requestBody.calories,
          difficulty_level: requestBody.difficulty_level,
          meal_type: requestBody.meal_type,
          no_of_serves: requestBody.no_of_serves,
          meal_time: requestBody.meal_time,
        }, {
          where: {
            recipe_info_id: recipe_info_id
          },
          transaction: t
        }),
        RecipeAllergenDBModel.destroy({
          where: {
            recipe_info_id: recipe_info_id
          },
          transaction: t
        }),
        RecipeAllergenDBModel.bulkCreate(allergen, { transaction: t }),
        RecipeDietaryDBModel.destroy({
          where: {
            recipe_info_id: recipe_info_id
          },
          transaction: t
        }),
        RecipeDietaryDBModel.bulkCreate(dietary, { transaction: t }),
        RecipeAgeGroupDBModel.destroy({
          where: {
            recipe_info_id: recipe_info_id
          },
          transaction: t
        }),
        RecipeAgeGroupDBModel.bulkCreate(ageGrop, { transaction: t }),
        RecipeHighlyNutriDBModel.destroy({
          where: {
            recipe_info_id: recipe_info_id
          },
          transaction: t
        }),
        RecipeHighlyNutriDBModel.bulkCreate(highyNutritional, { transaction: t }),
        RecipeNutritionalCatDBModel.destroy({
          where: {
            recipe_info_id: recipe_info_id
          },
          transaction: t
        }),
        RecipeNutritionalCatDBModel.bulkCreate(nutritionalCategory, { transaction: t })
      ])

      await t.commit();
      return result
    } catch (error) {
      await t.rollback();
      return error;
    }

  }
  public async deleteRecipeInfo(requestBody: any): Promise<any> {
    const recipeAry = requestBody.map(ids => parseInt(decrypted(ids)))
    return await RecipeInfoDBModel.findAll({
      where: { recipe_info_id: recipeAry }
    }).then((ingredient) => {
      ingredient.forEach(val => {
        val.status = 'inactive';
        val.save()
      })
      return 'Recipe is deleted successfully.'
    }).catch(err => {
      return 'Recipe is not Deleted.!'
    });

  }
  public async getRecipeIngt(
    requestBody: Partial<RequestBodyInterface>
  ): Promise<CollectionResultModel<RecipeIngredientInterface>> {
    const searchColumn = [
      "ing_category",
      "quantity",
      "ing_brandname",
      "measurements",
      "form"
    ];
    const postresSqlHelper = new PostgresqlHelper();
    const getQueryData = postresSqlHelper.tableListQuery(
      searchColumn,
      requestBody,
      RecipeIngredientDBModel)
    return await RecipeIngredientDBModel.findAndCountAll(
      getQueryData
    )

      .then((ingredientList) => {
        return new CollectionResultModel<RecipeIngredientInterface>(ingredientList, requestBody);
      });
  }

  public async addRecipeIngt(receipe: RecipeIntergrentAltInterface): Promise<any> {
    const payLoad: any = receipe.ingredients.map((ingredient: any) => {
      return RecipeIngredientModel.create(ingredient, receipe.recipeInfo)
    });
    const t = await sequelize.getSequelize.transaction();
    const getIngredient = await RecipeIngredientDBModel.findAll({
      where: {
        recipe_info_id: receipe.recipeInfo
      },
      transaction: t
    })
    if (getIngredient.length) {
      receipe.recipeInfo = encrypted(receipe.recipeInfo)
      return await this.updateRecipeIngt(receipe)

    } else {
      for (const list of payLoad) {
        await RecipeIngredientDBModel.create(list, {
          include: [RecipeAltIngredientDBModel],
          transaction: t
        })
      }
    }

    return await t.commit();
  }
  public async editRecipeIngt(id): Promise<any> {
    return await RecipeIngredientDBModel.findOne({
      where: {
        recipe_ing_id: decrypted(id),
      },
    });
  }

  public async updateRecipeIngt(requestBody: any): Promise<any> {
    const recipe_info_id = parseInt(decrypted(requestBody.recipeInfo));
    await RecipeIngredientDBModel.findAll({
      attributes: ['recipe_ing_id'],
      include: [{
        model: RecipeAltIngredientDBModel
      }],
      where: { recipe_info_id: recipe_info_id }
    }).then((toBeDeleted) => {
      if (toBeDeleted.length) {
        toBeDeleted.forEach(vals => {
          RecipeIngredientDBModel.destroy({
            where: {
              recipe_ing_id: vals.recipe_ing_id
            }
          });
          if (vals['alternateIngredient'].length) {
            RecipeAltIngredientDBModel.destroy({ where: { recipe_ing_id: vals['alternateIngredient'].map((val) => val.recipe_ing_id) } })
          }
        });
      }
    })
    const payLoad: any = requestBody.ingredients.map((ingredient: any) => {
      return RecipeIngredientModel.create(ingredient, recipe_info_id)
    });
    const t = await sequelize.getSequelize.transaction();
    for (const list of payLoad) {
      await RecipeIngredientDBModel.create(list, {
        include: [RecipeAltIngredientDBModel],
        transaction: t
      })
    }
    return await t.commit();
  }

  public async deleteRecipeIngt(requestBody: any): Promise<any> {
    const recipeAry = requestBody.map(ids => parseInt(decrypted(ids)))
    return await RecipeIngredientDBModel.findAll({
      where: { recipe_ing_id: recipeAry }
    }).then((ingredient) => {
      ingredient.forEach(val => {
        val.status = 'inactive';
        val.save()
      })
      return 'Recipe Ingredient deleted successfully.'
    }).catch(err => {
      return 'Recipe Ingredient is not Deleted.!'
    });

  }

  public async getRecipeAltIngt(
    requestBody: Partial<RequestBodyInterface>
  ): Promise<CollectionResultModel<RecipeAltIngredientInterface>> {
    const searchColumn = [
      "ing_category",
      "quantity",
      "ing_brandname",
    ];
    const postresSqlHelper = new PostgresqlHelper();
    const getQueryData = postresSqlHelper.tableListQuery(
      searchColumn,
      requestBody,
      RecipeAltIngredientDBModel)
    return await RecipeAltIngredientDBModel.findAndCountAll(
      getQueryData
    )

      .then((altingredientList) => {
        return new CollectionResultModel<RecipeAltIngredientInterface>(altingredientList, requestBody);
      });
  }

  public async addRecipeAltIngt(receipe: RequestRecipeAltIngredientInterface): Promise<any> {
    return await RecipeAltIngredientDBModel.create({
      recipe_ing_id: receipe.recipe_ing_id,
      ing_category_id: receipe.ing_category_id,
      quantity: receipe.quantity,
      ing_brandname_id: receipe.ing_brandname_id,
    })
  }

  public async editRecipeAltIngt(id): Promise<any> {
    return await RecipeAltIngredientDBModel.findOne({
      where: {
        recipe_ing_id: decrypted(id),
      },
    });
  }

  public async updateRecipeAltIngt(requestBody: any): Promise<any> {
    const alt_ing_id = parseInt(decrypted(requestBody.alt_ing_id));
    return await RecipeAltIngredientDBModel.findOne({
      where: { alt_ing_id: alt_ing_id }
    }).then(ingredientList => {
      ingredientList.ing_category_id = requestBody.ing_category_id;
      ingredientList.quantity = requestBody.quantity;
      ingredientList.ing_brandname_id = requestBody.ing_brandname_id,
        ingredientList.status = 'active';
      ingredientList.save();
      return 'Recipe Alternative Ingredient Updated successfully.'
    }).catch(error => {
      return 'Recipe Alternative Ingredient Updated failed.!'
    });
  }

  public async deleteRecipeAltIngt(requestBody: any): Promise<any> {
    const recipeAry = requestBody.map(ids => parseInt(decrypted(ids)))
    return await RecipeAltIngredientDBModel.findAll({
      where: { alt_ing_id: recipeAry }
    }).then((altingredient) => {
      altingredient.forEach(val => {
        val.status = 'inactive';
        val.save()
      })
      return 'Recipe Alternative Ingredient deleted successfully.'
    }).catch(err => {
      return 'Recipe Alternative Ingredient is not Deleted.!'
    });

  }

  public async getRecipeCookMthd(requestBody: Partial<RequestBodyInterface>): Promise<any> {
    const searchColumn = [
      "cooking_method"
    ];
    const postresSqlHelper = new PostgresqlHelper();
    const getQuery = postresSqlHelper.tableListQuery(
      searchColumn,
      requestBody,
      RecipeCookMthdDBModel)
    getQuery.include = [

    ]
    return await RecipeCookMthdDBModel.findAndCountAll(
      getQuery
    )
      .then((data) => {
        return new CollectionResultModel(data, requestBody);
      })
      .catch((err) => {
        return err;
      });
  }

  public async addRecipeCookMthd(receipe: RequestCookingMthdInterface): Promise<any> {
    const cooking_method_id = receipe.recipe_info_id;
    const cook = await RecipeCookMthdDBModel.findOne({
      where: { recipe_info_id: cooking_method_id }
    })
    if (cook) {
      return await RecipeCookMthdDBModel.update({
        cooking_method: receipe.cookmethod.cooking_method
      },
        { where: { recipe_info_id: cooking_method_id } })
    } else {
      return await RecipeCookMthdDBModel.create({
        cooking_method: receipe.cookmethod.cooking_method,
        recipe_info_id: cooking_method_id
      })
    }

  }

  public async editRecipeCookMtd(id): Promise<any> {
    return await RecipeCookMthdDBModel.findOne({
      where: {
        recipe_info_id: decrypted(id),
      },
    });
  }

  public async updateRecipeCookMtd(requestBody: any): Promise<any> {
    const cooking_method_id = parseInt(decrypted(requestBody.recipe_info_id));
    const cook = await RecipeCookMthdDBModel.findOne({
      where: { recipe_info_id: cooking_method_id }
    })
    if (cook) {
      return await RecipeCookMthdDBModel.update({
        cooking_method: requestBody.cooking_method
      },
        { where: { recipe_info_id: cooking_method_id } })
    } else {
      return await RecipeCookMthdDBModel.create({
        cooking_method: requestBody.cooking_method,
        recipe_info_id: cooking_method_id
      })
    }
  }

  public async deleteRecipeCookMthd(requestBody: any): Promise<any> {
    const cookAry = requestBody.map(ids => parseInt(decrypted(ids)))
    return await RecipeInfoDBModel.findAll({
      where: { cooking_method_id: cookAry }
    }).then((recipe) => {
      recipe.forEach(val => {
        val.status = 'inactive';
        val.save()
      })
      return 'Recipe Cooking Method deleted successfully.'
    }).catch(err => {
      return 'Cooking Method is not Deleted.!'
    });

  }



  public async getCookingTips(requestBody: Partial<RequestBodyInterface>): Promise<any> {
    const searchColumn = [
      "recipe_tips"
    ];
    const postresSqlHelper = new PostgresqlHelper();
    const getQuery = postresSqlHelper.tableListQuery(
      searchColumn,
      requestBody,
      RecipeTipsDBModel)
    getQuery.include = [

    ]
    return await RecipeTipsDBModel.findAndCountAll(
      getQuery
    )
      .then((data) => {
        return new CollectionResultModel(data, requestBody);
      })
      .catch((err) => {
        return err;
      });
  }


  public async addCookingTip(receipe: RequestRecipeTipsInterface): Promise<any> {
    const tips_id = receipe.recipe_info_id;

    const cookie = await RecipeTipsDBModel.findOne({
      where: { recipe_info_id: tips_id }
    })
    if (cookie) {
      return await RecipeTipsDBModel.update({
        recipe_tips: receipe.cookingtips.recipe_tips
      },
        { where: { recipe_info_id: tips_id } })
    } else {
      return await RecipeTipsDBModel.create({
        recipe_tips: receipe.cookingtips.recipe_tips,
        recipe_info_id: tips_id
      })
    }
  }

  public async editCookingTips(id): Promise<any> {
    return await RecipeTipsDBModel.findOne({
      where: {
        recipe_info_id: decrypted(id),
      },
    });
  }


  public async editRecipeInfo(id: string): Promise<any> {
    return await RecipeInfoDBModel.findOne({
      where: {
        recipe_info_id: decrypted(id),
      },
    });
  }

  public async updateCookingTips(requestBody: any): Promise<any> {
    const tips_id = parseInt(decrypted(requestBody.recipe_info_id));

    const cookie = await RecipeTipsDBModel.findOne({
      where: { recipe_info_id: tips_id }
    })
    if (cookie) {
      return await RecipeTipsDBModel.update({
        recipe_tips: requestBody.recipe_tips
      },
        { where: { recipe_info_id: tips_id } })
    } else {
      return await RecipeTipsDBModel.create({
        recipe_tips: requestBody.recipe_tips,
        recipe_info_id: tips_id
      })
    }
  }

  public async deleteCookingTips(requestBody: any): Promise<any> {
    const cookAry = requestBody.map(ids => parseInt(decrypted(ids)))
    return await RecipeInfoDBModel.findAll({
      where: { tips_id: cookAry }
    }).then((recipe) => {
      recipe.forEach(val => {
        val.status = 'inactive';
        val.save()
      })
      return 'Recipe Cooking Method deleted successfully.'
    }).catch(err => {
      return 'Cooking Method is not Deleted.!'
    });

  }



  public async getAllRecipeInfo(): Promise<any> {
    return await RecipeInfoDBModel.findAll(
      {
        include: [
          {
            model: RecipeDietaryDBModel,
            include: [DietaryDBModel]
          },
          {
            model: RecipeAgeGroupDBModel,
            include: [AgeGroupDBModel]
          },
          {
            model: RecipeAllergenDBModel,
            include: [AllergenDBModel]
          },
          {
            model: RecipeNutritionalCatDBModel,
            include: [NutritionCategoryDBModel]
          },
          {
            model: RecipeHighlyNutriDBModel,
            include: [HighlyNutritionalDBModel]
          },
          {
            model: MealTypeDBModel
          },
        ],
        where: {
          status: 'active'
        },
      }
    );
  }



  public async uploadImages(imageName: string,
    imageType: string,
    receipeIds: number,
    typeQuery: string,
    imageId: number): Promise<any> {
    const imageTypes = {
      iconImg: 'icon_image',
      thumbnailImg: 'thumbnail_image',
      bannerImg: 'banner_image',
      recipeMainImg: 'recipe_main_image'
    }
    const payLoad = {};
    payLoad['recipe_info_id'] = receipeIds;
    payLoad[imageTypes[imageType]] = imageName;
    if (typeQuery === 'create') {
      return await RecipeImageDBModel.create(payLoad);
    } else {
      return await RecipeImageDBModel.update(payLoad, {
        where: {
          recipe_image_id: imageId
        }
      })
    }

  }

  public async uploadVideos(videoName: string, receipeIds: number, typeQuery: string, videoId: number): Promise<any> {
    const payLoad = {
      recipe_info_id: receipeIds,
      video: videoName,
    };
    if (typeQuery === 'create') {
      return await RecipeVideoDBModel.create(payLoad);
    } else {
      return await RecipeVideoDBModel.update(payLoad, {
        where: {
          recipe_video_id: videoId
        }
      })

    }
  }

  public async editAllRecipes(id): Promise<any> {
    return await RecipeEditDBModel.findAll({
      include: [
        RecipeDietaryDBModel,
        RecipeAllergenDBModel,
        RecipeHighlyNutriDBModel,
        RecipeAgeGroupDBModel,
        RecipeNutritionalCatDBModel,
        {
          model: RecipeIngredientListDBModel, required: false,
          include: [{
            model: IngredientCategoryDBModel,
            required: true
          },
          { model: IngredientDBModel, required: false },
          {
            model: RecipeAltIngredientDBModel, required: false
          }]
        },
        { model: RecipeCookMthdDBModel },
        { model: RecipeTipsDBModel },
        { model: RecipeImageDBModel },
        { model: RecipeVideoDBModel },
      ], where: {
        recipe_info_id: parseInt(decrypted(id)),
      },
    });
  }

  public async getRecipesByFilters(
    filterFields: {
      ageGroup: number[],
      dietary: number[],
      allergen: number[],
      mealtype: number[],
    }[],
    search: string
  ): Promise<any> {
    try {
      let whereCondition: any = {
        status: 'active',
      };
      console.log(filterFields)
      if (filterFields && filterFields.length > 0) {
        const filter = filterFields[0];

        if (filter.ageGroup && filter.ageGroup.length > 0) {
          whereCondition['$age_group.age_group_id$'] = filter.ageGroup;
        }

        if (filter.dietary && filter.dietary.length > 0) {
          whereCondition['$dietary.dietary_id$'] = filter.dietary;
        }

        if (filter.allergen && filter.allergen.length > 0) {
          whereCondition['$allergen.allergen_id$'] = filter.allergen;
        }

        if (filter.mealtype && filter.mealtype.length > 0) {
          whereCondition['$mealType.meal_type_id$'] = filter.mealtype;
        }
      }

      if (search) {
        whereCondition['recipe_name'] = { [Op.iLike]: `%${search}%` };

      }

      const recipes = await RecipeInfoDBModel.findAll({
        include: [
          {
            model: RecipeAgeGroupDBModel,
            include: [{ all: true, nested: true }]
          },
          {
            model: RecipeAllergenDBModel,
            include: [{ all: true, nested: true }]
          },
          {
            model: RecipeDietaryDBModel,
            include: [{ all: true, nested: true }]
          },
          {
            model: MealTypeDBModel,
            include: [{ all: true, nested: true }]
          },
          { model: RecipeImageDBModel },
          {
            model: RecipeHighlyNutriDBModel,
          },
          {
            model: RecipeNutritionalCatDBModel,
            include: [{ model: NutritionCategoryDBModel }]
          },
        ],
        where: whereCondition
      });

      return recipes;
    } catch (err) {
      console.log(err);
      throw new Error('Failed to fetch recipes');
    }
  }


  public async uniqueValidation(requestBody: any): Promise<any> {
    return await RecipeInfoDBModel.findOne({
      where: {
        $and: Sequelize.where(
          Sequelize.fn('lower', Sequelize.col('recipe_name')),
          Sequelize.fn('lower', requestBody.recipe_name)
        ),
        status: 'active',
        recipe_info_id: { [Op.ne]: requestBody.recipe_info_id }
      }
    })
  }

  public async getAllRecipes(limit?: any): Promise<RecipeInfoDBModel[]> {

    try {
      const recipes = await RecipeInfoDBModel.findAll({
        include: [
          {
            model: MealTypeDBModel
          },
          {
            model: RecipeDietaryDBModel,
            include: [{ model: DietaryDBModel }]
          },
          {
            model: RecipeAllergenDBModel,
            include: [{ model: AllergenDBModel }]
          },
          {
            model: RecipeHighlyNutriDBModel,
          },
          {
            model: RecipeAgeGroupDBModel,
          },
          {
            model: RecipeNutritionalCatDBModel,
            include: [{ model: NutritionCategoryDBModel }]
          },
          {
            model: RecipeImageDBModel,
          },
        ],
        where: {
          status: 'active'
        },
        limit: limit,
        order: [
          ['updatedAt', 'DESC']
        ]
      });

      const updatedRecipes = [];

      for (let i = 0; i < recipes.length; i++) {
        const recipeId = recipes[i].recipe_info_id;

        if (recipeId) {
          const ratingStatus = await this.ratingsReviewService.getRecipeRatingStatus(recipeId);
          const avg = { averageRating: ratingStatus.averageRating };
          const recipeWithoutAssociations = {
            ...recipes[i].get({ plain: true }),

          };
          const updatedRecipe = { ...recipeWithoutAssociations, ...avg };
          updatedRecipes.push(updatedRecipe);
        }
      }

      return updatedRecipes;

    } catch (error) {
      throw new Error(`Unable to fetch recipes: ${error.message}`);
    }

  }

  public async MostlyConsumedRecipes(fdate, todate): Promise<any> {
    const recipes = await RecipeInfoDBModel.findAll({
      where: {
        mostly_consumed: true,
        createdAt: {
          [Op.between]: [fdate, todate]
        },
        status: 'active'
      }
    });
    return { content: recipes, count: recipes.length };
  }

  public async mostlyLikedRecipes(sd, ed): Promise<number> {
    const count = await RecipeInfoDBModel.findAll({
      where: {
        mostly_liked: true,
        createdAt: {
          [Op.between]: [sd, ed]
        },
        status: 'active'
      }
    });
    const counting = count.length;
    return counting;
  }

  public async nutritionRichRecipes(fdate, todate): Promise<any> {
    const recipes = await RecipeInfoDBModel.findAll({
      where: {
        nutrition_rich: true,
        createdAt: {
          [Op.between]: [fdate, todate]
        },
        status: 'active'
      }
    });
    return { content: recipes, count: recipes.length };
  }
  public async getAllRecipesCount(sd, ed): Promise<any> {
    console.log('fdffd', sd, ed)
    const recipes = await RecipeInfoDBModel.findAll({
      where: {
        createdAt: {
          [Op.between]: [sd, ed]
        },
        status: 'active'
      }
    });

    return { content: recipes, count: recipes.length };
  }

  public async getRecipesVsDietary(): Promise<any> {
    try {
      const recipeDietaryInfo = await RecipeDietaryDBModel.findAll({
        attributes: [
          [Sequelize.literal('dietary_details.dietary_id'), 'dietary_id'],
          [Sequelize.literal('dietary_details.dietary'), 'dietary'],
          [Sequelize.fn('COUNT', Sequelize.col('dietary_details.dietary_id')), 'count']
        ],
        include: [
          {
            model: DietaryDBModel,
            as: 'dietary_details',
            attributes: []
          },
          {
            model: RecipeInfoDBModel,
            where: {
              status: 'active'
            },
            attributes: [],
            include: []
          }
        ],
        group: ['dietary_details.dietary_id', 'dietary_details.dietary']
      });
      return recipeDietaryInfo;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to retrieve recipes vs dietary information');
    }
  }
  public async updateImages(recipeInfoId: number, newImageData: any): Promise<void> {
    try {
      const existingImageData = await RecipeImageDBModel.findOne({
        where: { recipe_info_id: recipeInfoId },
      });

      if (!existingImageData) {
        throw new Error('Recipe image data not found.');
      }
      const updatedData: any = {};
      if (newImageData.thumbnailImg) {
        updatedData.thumbnail_image = newImageData.thumbnailImg;
      } else {
        updatedData.thumbnail_image = existingImageData.getDataValue('thumbnail_image');
      }
      if (newImageData.iconImg) {
        updatedData.icon_image = newImageData.iconImg;
      } else {
        updatedData.icon_image = existingImageData.getDataValue('icon_image');
      }
      if (newImageData.recipeMainImg) {
        updatedData.recipe_main_image = newImageData.recipeMainImg;
      } else {
        updatedData.recipe_main_image = existingImageData.getDataValue('recipe_main_image');
      }
      if (newImageData.bannerImg) {
        updatedData.banner_image = newImageData.bannerImg;
      } else {
        updatedData.banner_image = existingImageData.getDataValue('banner_image');
      }
      await RecipeImageDBModel.update(updatedData, {
        where: { recipe_info_id: recipeInfoId },
      });
    } catch (error) {
      throw new Error('Error updating images: ' + error.message);
    }
  }

}
