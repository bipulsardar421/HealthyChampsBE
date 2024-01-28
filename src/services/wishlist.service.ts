
import { Op } from "sequelize";
import model, { Model } from "sequelize/types/model";
import { decrypted, encrypted, PostgresqlHelper, sequelize } from "../helper";
import { CollectionResultModel, RecipeAddModel } from "../model";
import { WishlistBlogDBModel, WishlistWorkshopDBModel, WishlistRecipeDBModel, BlogInfoDBModel, RecipeInfoDBModel, RecipeImageDBModel, 
 BlogImageDBModel, WorkshopInfoDBModel, WorkshopImageDBModel, WishlistCourseDBModel, WishlistPodcastDBModel, CourseInfoDBModel, CourseImageDBModel, PodcastsInfoDBModel, PodcastsImageDBModel } from "../db-models";



export class WishListService {
    value: string;
    self = this;
    constructor() {
    }


    public async addWishlistWorkshop(pId: any, workshopInfoId: any) {
        const parentId = parseInt(decrypted(pId))
        try {
            const wishlistWorkshop = await WishlistWorkshopDBModel.create({
                parent_id: parentId,
                workshop_info_id:  parseInt(decrypted(workshopInfoId)),
            });
            return wishlistWorkshop;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async addWishlistBlog(pId: any, blogInfoId: any) {
        const parentId = parseInt(decrypted(pId))
        try {
            const wishlistBlog = await WishlistBlogDBModel.create({
                parent_id: parentId,
                blog_info_id: parseInt(decrypted(blogInfoId)),
            });
            return wishlistBlog;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async addWishlistRecipe(pId: any, recipeInfoId: any) {
        const parentId = parseInt(decrypted(pId))
        try {
            const wishlistRecipe = await WishlistRecipeDBModel.create({
                parent_id: parentId,
                recipe_info_id: parseInt(decrypted(recipeInfoId)),
            });
            return wishlistRecipe;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async addWishlistCourse(pId: any, CourseInfoId: any) {
        const parentId = parseInt(decrypted(pId))
        try {
            const wishlistCourse = await WishlistCourseDBModel.create({
                parent_id: parentId,
                course_info_id: parseInt(decrypted(CourseInfoId)),
            });
            return wishlistCourse;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async addWishlistPodcast(pId: any, podcastInfoId: any) {
        const parentId = parseInt(decrypted(pId))
        console.log('@@@', parentId)
        try {
            const wishlistPodcast = await WishlistPodcastDBModel.create({
                parent_id: parentId,
                podcasts_info_id: parseInt(decrypted(podcastInfoId)),
            });
            return wishlistPodcast;
        } catch (error) {
            console.error(error);
            throw error;
        }
        
    }

    public async removeWishlistWorkshop(pId: string, workshopInfoId: any) {
        const parentId = parseInt(decrypted(pId))
        const workshopId = parseInt(decrypted(workshopInfoId))
        try {
            const data = await WishlistWorkshopDBModel.findOne({
                where: { parent_id: parentId, workshop_info_id: workshopId }
            });
            if (data) {
                await WishlistWorkshopDBModel.destroy({
                    where: { parent_id: parentId, workshop_info_id: workshopId }
                });
            } else {
                return "Wishlist workshop item not found."
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    public async removeWishlistBlog(pId: string, blogInfoId: any) {
        const parentId = parseInt(decrypted(pId))
        const blogId = parseInt(decrypted(blogInfoId))
        try {
            const data = await WishlistBlogDBModel.findOne({
                where: { parent_id: parentId, blog_info_id: blogId }
            });
            if (data) {
                await WishlistBlogDBModel.destroy({
                    where: { parent_id: parentId, blog_info_id: blogId }
                });
            } else {
                return "Wishlist blog item not found."
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    public async removeWishlistRecipe(pId: string, recipeInfoId: any) {
        const parentId = parseInt(decrypted(pId))
        const recipeId = parseInt(decrypted(recipeInfoId))
        try {
            const data = await WishlistRecipeDBModel.findOne({
                where: { parent_id: parentId, recipe_info_id: recipeId }
            });
            if (data) {
                await WishlistRecipeDBModel.destroy({
                    where: { parent_id: parentId, recipe_info_id: recipeId }
                });
            } else {
                return "Wishlist recipe item not found."
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    public async removeWishlistCourse(pId: string, courseInfoId: any) {
        const parentId = parseInt(decrypted(pId))
        const courseId = parseInt(decrypted(courseInfoId))
        try {
            const data = await WishlistCourseDBModel.findOne({
                where: { parent_id: parentId, course_info_id: courseId }
            });
            if (data) {
                await WishlistCourseDBModel.destroy({
                    where: { parent_id: parentId, course_info_id: courseId }
                });
            } else {
                return "Wishlist course item not found."
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    public async removeWishlistPodcast(pId: string, podcastInfoId: any) {
        const parentId = parseInt(decrypted(pId))
        const podcastId = parseInt(decrypted(podcastInfoId))
        try {
            const data = await WishlistPodcastDBModel.findOne({
                where: { parent_id: parentId, podcasts_info_id: podcastId }
            });
            if (data) {
                await WishlistPodcastDBModel.destroy({
                    where: { parent_id: parentId, podcasts_info_id: podcastId }
                });
            } else {
                return "Wishlist podcast item not found."
            }
        } catch (err) {
            console.error(err);
            throw err;
        }
    }
    public async getWishlistWorkshop(pId: string, workshop_info_id: any) {
        const parentId = parseInt(decrypted(pId))
        try {
            const workshopItems = await WishlistWorkshopDBModel.findAll({
                where: { parent_id: parentId, workshop_info_id: workshop_info_id },
                include: [{
                    model: WorkshopInfoDBModel,
                    include: [WorkshopImageDBModel]
                }]
            });
            if (workshopItems.length) {
                return { found: true, workshopItems };
            }
            else {
                return { found: true, msg: "No data found" }
            }
        } catch (err) {
            throw err;
        }
    }
    public async getWishlistRecipe(pId: string, recipe_info_id: any) {
        const parentId = parseInt(decrypted(pId))
        try {
            const recipeItems = await WishlistRecipeDBModel.findAll({
                where: { parent_id: parentId, recipe_info_id: recipe_info_id },
                include: [{
                    model: RecipeInfoDBModel,
                    include: [RecipeImageDBModel]
                }]
            });
            if (recipeItems.length) {
                return { found: true, recipeItems };
            }
            else {
                return { found: true, msg: "No data found" }
            }
        } catch (err) {
            throw err;
        }
    }
    public async getWishlistBlog(pId: string, blog_info_id: any) {
        const parentId = parseInt(decrypted(pId))
        try {
            const blogItems = await WishlistBlogDBModel.findAll({
                where: { parent_id: parentId, blog_info_id: blog_info_id },
                include: [{
                    model: BlogInfoDBModel,
                    include: [BlogImageDBModel]
                }]
            });
            if (blogItems.length) {
                return { found: true, blogItems };
            }
            else {
                return { found: true, msg: "No data found" }
            }
        } catch (err) {
            throw err;
        }
    }

    public async getWishlistCourse(pId: string, course_info_id: any) {
        const parentId = parseInt(decrypted(pId))
        try {
            const courseItems = await WishlistCourseDBModel.findAll({
                where: { parent_id: parentId, course_info_id: course_info_id },
                include: [{
                    model: CourseInfoDBModel,
                    include: [CourseImageDBModel]
                }]
            });
            if (courseItems.length) {
                return { found: true, courseItems };
            }
            else {
                return { found: true, msg: "No data found" }
            }
        } catch (err) {
            throw err;
        }
    }

    public async getWishlistPodcast(pId: string, podcast_info_id: any) {
        const parentId = parseInt(decrypted(pId))
        try {
            const podcastItems = await WishlistPodcastDBModel.findAll({
                where: { parent_id: parentId, podcasts_info_id: podcast_info_id },
                include: [{
                    model: PodcastsInfoDBModel,
                    include: [PodcastsImageDBModel]
                }]
            });
            if (podcastItems.length) {
                return { found: true, podcastItems };
            }
            else {
                return { found: true, msg: "No data found" }
            }
        } catch (err) {
            throw err;
        }
    }

    public async getAllWishlistItems(pId: string) {
        const parentId = parseInt(decrypted(pId))
        try {
            const workshopItems = await WishlistWorkshopDBModel.findAll({
                where: { parent_id: parentId },
                include: [{
                    model: WorkshopInfoDBModel,
                    include: [WorkshopImageDBModel]
                }]
            });

            const blogItems = await WishlistBlogDBModel.findAll({
                where: { parent_id: parentId },
                include: [{
                    model: BlogInfoDBModel,
                    include: [BlogImageDBModel]
                }]
            });

            const recipeItems = await WishlistRecipeDBModel.findAll({
                where: { parent_id: parentId },
                include: [{
                    model: RecipeInfoDBModel,
                    include: [RecipeImageDBModel]
                }]
            });

            const courseItems = await WishlistCourseDBModel.findAll({
                where: { parent_id: parentId },
                include: [{
                    model: CourseInfoDBModel,
                    include: [CourseImageDBModel]
                }]
            });

            const podcastItems = await WishlistPodcastDBModel.findAll({
                where: { parent_id: parentId },
                include: [{
                    model: PodcastsInfoDBModel,
                    include: [PodcastsImageDBModel]
                }]
            });

            const result: {
                workshopItems?: any[];
                blogItems?: any[];
                recipeItems?: any[];
                courseItems?: any[];
                podcastItems?: any[];
            } = {};

            if (workshopItems.length > 0) {
                result.workshopItems = workshopItems;
            }

            if (blogItems.length > 0) {
                result.blogItems = blogItems;
            }

            if (recipeItems.length > 0) {
                result.recipeItems = recipeItems;
            }
            if (courseItems.length > 0) {
                result.courseItems = courseItems;
            }
            if (podcastItems.length > 0) {
                result.podcastItems = podcastItems;
            }
           return result;
        } catch (err) {
            throw err;
        }
    }

}
