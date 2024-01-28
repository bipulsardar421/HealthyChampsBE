
import { Op } from "sequelize";
import model, { Model } from "sequelize/types/model";
import { decrypted, encrypted, PostgresqlHelper, sequelize } from "../helper";
import { CollectionResultModel, RecipeAddModel } from "../model";
import * as models from "../db-models"

export class GenericSearchService {
    value: string;
    self = this;
    constructor() {
    }

    public async genericSearch(searchTerms) {
        const modelName = ['RecipeInfoDBModel', 'BlogInfoDBModel', 'CourseInfoDBModel', 'WorkshopInfoDBModel', 'MealPlanDBModel'];
        const includedAttributes = {
            'RecipeInfoDBModel': ['recipe_name'],
            'BlogInfoDBModel': ['blog_title'],
            'CourseInfoDBModel': ['course_name'],
            'WorkshopInfoDBModel': ['title'],
            'MealPlanDBModel': ['meal_plan_name']
        };
    
        const associations = {
            'RecipeInfoDBModel': [models.RecipeImageDBModel],
            'BlogInfoDBModel': [models.BlogImageDBModel],
            'CourseInfoDBModel': [models.CourseImageDBModel],
            'WorkshopInfoDBModel': [models.WorkshopImageDBModel],
            'MealPlanDBModel': []
        };
    
        let results = [];
    
        for (const model of modelName) {
            if (includedAttributes[model]) {
                const attributes = includedAttributes[model];
                const searchConditions = attributes.map(attribute => ({
                    [attribute]: { [Op.iLike]: `%${searchTerms}%` }
                }));
    
                const query = {
                    where: {
                        [Op.or]: searchConditions,
                        status: 'active'
                    },
                    include: associations[model],
                };
    
                const modelResults = await models[model].findAll(query);
                results.push({ model: model, result: modelResults });
            }
        }
    
        return results;
    }
    
    


}
