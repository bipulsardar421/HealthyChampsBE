
import { BlogInfoDBModel, BlogRatingsDBModel, ParentInfoDBModel, ParentProfileImageDBModel, RecipeInfoDBModel, RecipeRatingsDBModel, WorkshopInfoDBModel, WorkshopRatingsDBModel } from "../db-models";
import { Op, QueryTypes, Sequelize } from "sequelize";
import { sequelize, decrypted, encrypted } from "../helper";


export class RatingsReviewService {
  value: string;
  self = this;

  constructor() { }




  public async getRecipeRatings(parentId?: any): Promise<RecipeRatingsDBModel[]> {
    try {
      const ratingsAndReviews = await RecipeRatingsDBModel.findAll({
        where: { status: 'active' },
        include: [{
          model: ParentInfoDBModel,
          include: [ParentProfileImageDBModel]
        },
        {
          model: RecipeInfoDBModel,
          attributes: ['recipe_name']
        }]
      });
      return ratingsAndReviews;
    } catch (error) {
      throw error;
    }
  }

  public async getWorkshopRatings(parentId?: any): Promise<WorkshopRatingsDBModel[]> {
    try {
      const ratingsAndReviews = await WorkshopRatingsDBModel.findAll({
        where: { status: 'active' },
        include: [{
          model: ParentInfoDBModel,
          include: [ParentProfileImageDBModel]
        },
        {
          model: WorkshopInfoDBModel
        }]
      });
      return ratingsAndReviews;
    } catch (error) {
      throw error;
    }
  }

  public async getBlogRatings(): Promise<BlogRatingsDBModel[]> {
    try {
      const ratingsAndReviews = await BlogRatingsDBModel.findAll({
        where: { status: 'active' },
        include: [{
          model: ParentInfoDBModel,
          include: [ParentProfileImageDBModel]
        },
        { model: BlogInfoDBModel }]
      });
      return ratingsAndReviews;
    } catch (error) {
      throw error;
    }
  }

  public async addRecipeRating(
    parent_id: string,
    recipe_info_id: string,
    recipe_rating: number,
    recipe_review?: string,
  ): Promise<RecipeRatingsDBModel> {
    try {
      const ParentId = parseInt(decrypted(parent_id));
      const RecipeInfoId = parseInt(decrypted(recipe_info_id));

      const newRating = await RecipeRatingsDBModel.create({
        parent_id: ParentId,
        recipe_info_id: RecipeInfoId,
        recipe_rating: recipe_rating,
        recipe_review: recipe_review,
      });

      return newRating;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async addWorkshopRating(
    parent_id: string,
    workshop_info_id: string,
    workshop_rating: number,
    workshop_review?: string,
  ): Promise<WorkshopRatingsDBModel> {
    try {
      const ParentId = parseInt(decrypted(parent_id));
      const WorkshopInfoId = parseInt(decrypted(workshop_info_id));

      const newRating = await WorkshopRatingsDBModel.create({
        parent_id: ParentId,
        workshop_info_id: WorkshopInfoId,
        workshop_rating: workshop_rating,
        workshop_review: workshop_review
      });
      return newRating;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async addBlogRating(
    parent_id: string,
    blog_info_id: string,
    blog_rating: number,
    blog_review?: string,
  ): Promise<BlogRatingsDBModel> {
    try {
      const ParentId = parseInt(decrypted(parent_id));
      const BlogInfoId = parseInt(decrypted(blog_info_id));
      console.log(blog_info_id, blog_rating, blog_review)
      const newRating = await BlogRatingsDBModel.create({
        parent_id: ParentId,
        blog_info_id: BlogInfoId,
        blog_rating: blog_rating,
        blog_review: blog_review,
      });
      return newRating;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async getRecipeRatingStatus(recipeId: any): Promise<any> {
    try {
      const recipeInfoId = parseInt(decrypted(recipeId));
      const ratings = await RecipeRatingsDBModel.findAll({
        where: { recipe_info_id: recipeInfoId },
        include: [{
          model: ParentInfoDBModel,
          include: [ParentProfileImageDBModel]
        }],
      });
      const totalRating = ratings.reduce((sum, rating) => sum + rating.recipe_rating, 0);
      const averageRating = totalRating / ratings.length;
      let ex = 0;
      let good = 0;
      let avg = 0;

      for (let i = 0; i < ratings.length; i++) {
        const rating = ratings[i].recipe_rating
        if (rating >= 4.0) {
          ex++;
        } else if (rating > 3.0 && rating < 4.0) {
          good++;
        } else if (rating <= 3.0) {
          avg++;
        }
      }
      const rated = {
        Excellent: ex / ratings.length * 100,
        Good: good / ratings.length * 100,
        Average: avg / ratings.length * 100
      }
      return {
        recipeInfoId: recipeId,
        ratings,
        averageRating,
        rated
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  public async getWorkshopRatingStatus(workshopId: any): Promise<any> {
    try {
      const workshopInfoId = parseInt(decrypted(workshopId));
      const ratings = await WorkshopRatingsDBModel.findAll({
        where: { workshop_info_id: workshopInfoId },
        include: [{
          model: ParentInfoDBModel,
          include: [ParentProfileImageDBModel]
        }],
      });
      const totalRating = ratings.reduce((sum, rating) => sum + rating.workshop_rating, 0);
      const averageRating = totalRating / ratings.length;
      console.log(totalRating)
      let ex = 0;
      let good = 0;
      let avg = 0;

      for (let i = 0; i < ratings.length; i++) {
        const rating = ratings[i].workshop_rating
        if (rating >= 4.0) {
          ex++;
        } else if (rating > 3.0 && rating < 4.0) {
          good++;
        } else if (rating <= 3.0) {
          avg++;
        }
      }
      console.log(ex, good, avg)
      const rated = {
        Excellent: ex / ratings.length * 100,
        Good: good / ratings.length * 100,
        Average: avg / ratings.length * 100
      }
      return {
        workshopInfoId: workshopId,
        ratings,
        averageRating,
        rated
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }


  public async getBlogRatingStatus(blogId: any): Promise<any> {
    try {
      const blogInfoId = parseInt(decrypted(blogId));
      const ratings = await BlogRatingsDBModel.findAll({
        where: { blog_info_id: blogInfoId },
        include: [{
          model: ParentInfoDBModel,
          include: [ParentProfileImageDBModel]
        }],
      });
      const totalRating = ratings.reduce((sum, rating) => sum + rating.blog_rating, 0);
      const averageRating = totalRating / ratings.length;
      console.log(totalRating)
      let ex = 0;
      let good = 0;
      let avg = 0;

      for (let i = 0; i < ratings.length; i++) {
        const rating = ratings[i].blog_rating
        if (rating >= 4.0) {
          ex++;
        } else if (rating > 3.0 && rating < 4.0) {
          good++;
        } else if (rating <= 3.0) {
          avg++;
        }
      }
      console.log(ex, good, avg)
      const rated = {
        Excellent: ex / ratings.length * 100,
        Good: good / ratings.length * 100,
        Average: avg / ratings.length * 100
      }
      return {
        blogInfoId: blogId,
        ratings,
        averageRating,
        rated
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  public async removeRecipeRating(parentId: string, recipeRatingsId: any) {
    try {
      const ParentId = parseInt(decrypted(parentId));
      const ReciperatId = parseInt(decrypted(recipeRatingsId));

      const data = await RecipeRatingsDBModel.findOne({
        where: { parent_id: ParentId, recipe_ratings_id: ReciperatId }
      });

      if (data) {
        await RecipeRatingsDBModel.destroy({
          where: { parent_id: ParentId, recipe_ratings_id: ReciperatId }
        });
      } else {
        throw new Error("Recipe rating not found.");
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }


  public async removeWorkshopRating(parentId: string, workshopRatingsId: any) {
    try {
      const ParentId = parseInt(decrypted(parentId));
      const WorkshopRatId = parseInt(decrypted(workshopRatingsId));

      const data = await WorkshopRatingsDBModel.findOne({
        where: { parent_id: ParentId, workshop_ratings_id: WorkshopRatId }
      });

      if (data) {
        await WorkshopRatingsDBModel.destroy({
          where: { parent_id: ParentId, workshop_ratings_id: WorkshopRatId }
        });
      } else {
        throw new Error("Workshop rating not found.");
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }


  public async removeBlogRating(parentId: string, blogRatingId: any) {
    try {
      const ParentId = parseInt(decrypted(parentId));
      const BlogRatId = parseInt(decrypted(blogRatingId));

      const data = await BlogRatingsDBModel.findOne({
        where: { parent_id: ParentId, blog_ratings_id: BlogRatId }
      });

      if (data) {
        await BlogRatingsDBModel.destroy({
          where: { parent_id: ParentId, blog_ratings_id: BlogRatId }
        });
      } else {
        throw new Error("Blog rating not found.");
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  }


  public async getAllRatingsAndReviews(parentId: string) {
    try {
      const recipeRatings = await RecipeRatingsDBModel.findAll({
        where: { parent_id: parentId },
        include: [{
          model: RecipeInfoDBModel,
        }]
      });

      const workshopRatings = await WorkshopRatingsDBModel.findAll({
        where: { parent_id: parentId },
        include: [{
          model: WorkshopInfoDBModel,
        }]
      });

      const blogRatings = await BlogRatingsDBModel.findAll({
        where: { parent_id: parentId },
        include: [{
          model: BlogInfoDBModel,
        }]
      });

      const result: {
        recipeRatings?: any[];
        workshopRatings?: any[];
        blogRatings?: any[];
      } = {};

      if (recipeRatings.length > 0) {
        result.recipeRatings = recipeRatings;
      }

      if (workshopRatings.length > 0) {
        result.workshopRatings = workshopRatings;
      }

      if (blogRatings.length > 0) {
        result.blogRatings = blogRatings;
      }

      return result;
    } catch (err) {
      throw err;
    }
  }

  //  public async getTopRatedRecipesCount(): Promise<any> {
  //     try {
  //       const topRating = await RecipeRatingsDBModel.findOne({
  //         order: [['recipe_rating', 'DESC']],
  //       });
  //       return topRating;
  //     } catch (error) {
  //       console.error('Error fetching top-rated recipes count:', error);
  //       throw new Error('Internal Server Error');
  //     }
  //   }
  public async getTopRatedRecipesCount(ratingThreshold: number): Promise<number> {
    try {
      const count = await RecipeRatingsDBModel.count({
        where: {
          recipe_rating: {
            [Op.gte]: ratingThreshold,
          },
          status: 'active',
        },
      });

      return count;
    } catch (error) {
      console.error('Error calculating top-rated recipe count:', error);
      throw new Error('Internal Server Error');
    }
  }

  public async getAverageRating(): Promise<any> {
    try {
      const result = await RecipeRatingsDBModel.findAll({
        attributes: [[Sequelize.fn('AVG', Sequelize.col('recipe_rating')), 'average_rating']],
        where: { status: 'active' },
      });

      // return result?.getDataValue('average_rating') || 0;
    } catch (error) {
      console.error('Error calculating average rating:', error);
      throw new Error('Internal Server Error');
    }
  }

}


