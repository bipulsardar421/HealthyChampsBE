import { Router } from "express";
import { AppRoute } from "../app-route";
import AppLogger from "..//helper/app-logger";
import { Api, decrypted, PostgresqlHelper, encrypted } from "../helper";
import { WishListService } from "../services";




export class WishlistController implements AppRoute {
    route = "/wishlist";
    router: Router = Router();


    constructor() {
        this.router.post("/getWishlist", this.getAllWishlistItems);
        this.router.post("/addWishlistWorkshop", this.addWishlistWorkshop);
        this.router.post("/addWishlistBlog", this.addWishlistBlog);
        this.router.post("/addWishlistRecipe", this.addWishlistRecipe);
        this.router.post("/addWishlistCourses", this.addWishlistCourse);
        this.router.post("/addWishlistPodcast", this.addWishlistPodcast)
        this.router.post("/removeWishlistWorkshop", this.removeWishlistWorkshop);
        this.router.post("/removeWishlistBlog", this.removeWishlistBlog);
        this.router.post("/removeWishlistRecipe", this.removeWishlistRecipe);
        this.router.post("/removeWishlistCourse", this.removeWishlistCourse);
        this.router.post("/removeWishlistPodcast", this.removeWishlistPodcast);
        this.router.post("/getWishlistWorkshop", this.getWishlistWorkshop);
        this.router.post("/getWishlistBlog", this.getWishlistBlog);
        this.router.post("/getWishlistRecipe", this.getWishlistRecipe);
        this.router.post("/getWishlistCourse", this.getWishlistCourse);
        this.router.post("/getWishlistPodcast", this.getWishlistPodcast);
    }

    private async getAllWishlistItems(req: any, res: any) {
        const parentId = req.body['parentId'];
        try {
            const wishlistItems = new WishListService()
            const items = await wishlistItems.getAllWishlistItems(parentId);
            res.json(items);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while fetching wishlist items.' });
        }
    }

    private async getWishlistWorkshop(req: any, res: any) {
        const { parentId, workshop_info_id } = req.body;
        const id = parseInt(decrypted(workshop_info_id))
        try {
            const wishlistItems = new WishListService()
            const items = await wishlistItems.getWishlistWorkshop(parentId, id);
            res.json(items);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while fetching wishlist items.' });
        }
    }
    private async getWishlistBlog(req: any, res: any) {
        const { parentId, blog_info_id } = req.body;
        const id = parseInt(decrypted(blog_info_id))
        try {
            const wishlistItems = new WishListService()
            const items = await wishlistItems.getWishlistBlog(parentId, id);
            res.json(items);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while fetching wishlist items.' });
        }
    }
    private async getWishlistRecipe(req: any, res: any) {
        const { parentId, recipe_info_id } = req.body;
        console.log(recipe_info_id);
        const id = parseInt(decrypted(recipe_info_id))
        try {
            const wishlistItems = new WishListService()
            const items = await wishlistItems.getWishlistRecipe(parentId, id);
            res.json(items);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while fetching wishlist items.' });
        }
    }

    private async getWishlistCourse(req: any, res: any) {
        const { parentId, course_info_id } = req.body;
        const id = parseInt(decrypted(course_info_id))
        try {
            const wishlistItems = new WishListService()
            const items = await wishlistItems.getWishlistCourse(parentId, id);
            res.json(items);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while fetching wishlist items.' });
        }
    }

    private async getWishlistPodcast(req: any, res: any) {
        const { parentId, podcasts_info_id } = req.body;
        const id = parseInt(decrypted(podcasts_info_id))
        try {
            const wishlistItems = new WishListService()
            const items = await wishlistItems.getWishlistPodcast(parentId, id);
            res.json(items);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while fetching wishlist items.' });
        }
    }
    private async addWishlistWorkshop(req: any, res: any) {
        const parentId = req.body.parentId;
        const workshopInfoId = req.body.workshopInfoId;

        try {
            const wishlistService = new WishListService();
            await wishlistService.addWishlistWorkshop(parentId, workshopInfoId);
            res.json("Successfull");
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while adding the wishlist item.' });
        }
    }

    private async addWishlistBlog(req: any, res: any) {
        const parentId = req.body.parentId;
        const blogInfoId = req.body.blogInfoId;
        try {
            const wishlistService = new WishListService();
            await wishlistService.addWishlistBlog(parentId, blogInfoId);
            res.json("Successfull");
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while adding the wishlist item.' });
        }
    }

    private async addWishlistRecipe(req: any, res: any) {
        const pID = decrypted(req.body.parentId) ? req.body.parentId : encrypted(req.body.parentId);
        const rID = decrypted(req.body.recipeInfoId) ? req.body.recipeInfoId : encrypted(req.body.recipeInfoId);
        console.log(pID, rID);

        try {
            const wishlistService = new WishListService();
            await wishlistService.addWishlistRecipe(pID, rID);
            res.json("Successful");
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while adding the wishlist item.' });
        }
    }


    private async addWishlistPodcast(req: any, res: any) {
        const parentId = req.body.parentId;
        const podcastsInfoId = req.body.podcastsInfoId;
        console.log("Parent ID:", parentId);
        console.log("Podcast Info ID:", podcastsInfoId);

        try {
            const wishlistService = new WishListService();
            await wishlistService.addWishlistPodcast(parentId, podcastsInfoId);
            res.json("Successfull");
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while adding the wishlist item.' });
        }
    }

    private async addWishlistCourse(req: any, res: any) {
        const parentId = req.body.parentId;
        const courseInfoId = req.body.courseInfoId;

        try {
            const wishlistService = new WishListService();
            await wishlistService.addWishlistCourse(parentId, courseInfoId);
            res.json("Successfull");
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while adding the wishlist item.' });
        }
    }


    private async removeWishlistWorkshop(req: any, res: any) {
        const { parentId, workshopInfoId } = req.body;
        console.log(parentId, workshopInfoId)
        try {
            const wishlistService = new WishListService();
            const message = await wishlistService.removeWishlistWorkshop(parentId, workshopInfoId);

            if (typeof message === 'string') {
                res.status(404).json({ error: message });
            } else {
                res.json({ message: "Wishlist workshop item has been removed." });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while removing wishlist workshop item." });
        }
    }

    private async removeWishlistBlog(req: any, res: any) {
        const { parentId, blogInfoId } = req.body;
        try {
            const wishlistService = new WishListService();
            const message = await wishlistService.removeWishlistBlog(parentId, blogInfoId);

            if (typeof message === 'string') {
                res.status(404).json({ error: message });
            } else {
                res.json({ message: "Wishlist blog item has been removed." });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while removing wishlist blog item." });
        }
    }

    private async removeWishlistRecipe(req: any, res: any) {
        const { parentId, recipeInfoId } = req.body;
        try {
            const wishlistService = new WishListService();
            const message = await wishlistService.removeWishlistRecipe(parentId, recipeInfoId);

            if (typeof message === 'string') {
                res.status(404).json({ error: message });
            } else {
                res.json({ message: "Wishlist recipe item has been removed." });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while removing wishlist recipe item." });
        }
    }

    private async removeWishlistCourse(req: any, res: any) {
        const { parentId, courseInfoId } = req.body;
        try {
            const wishlistService = new WishListService();
            const message = await wishlistService.removeWishlistCourse(parentId, courseInfoId);

            if (typeof message === 'string') {
                res.status(404).json({ error: message });
            } else {
                res.json({ message: "Wishlist course item has been removed." });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while removing wishlist course item." });
        }
    }

    private async removeWishlistPodcast(req: any, res: any) {
        const { parentId, podcastInfoId } = req.body;
        try {
            const wishlistService = new WishListService();
            const message = await wishlistService.removeWishlistPodcast(parentId, podcastInfoId);

            if (typeof message === 'string') {
                res.status(404).json({ error: message });
            } else {
                res.json({ message: "Wishlist  item has been removed." });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while removing wishlist podcast item." });
        }
    }

}
