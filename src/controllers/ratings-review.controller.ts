import { Router, Request, Response } from "express";
import { AppRoute } from "src/app-route";
import { RatingsReviewService } from "../services";
import { decrypted, encrypted } from "../helper";

export class RatingsReviewController implements AppRoute {
  route = "/ratings_review";
  router: Router = Router();

  constructor() {
    this.router.get("/getTopRatedRecipes", this.getTopRatedRecipesCount);
    this.router.get("/getRecipeRating", this.getRecipeRating);
    this.router.get("/getWorkshopRating", this.getWorkshopRating);
    this.router.get("/getBlogRating", this.getBlogRating);
    this.router.post("/addRecipeRatings", this.addRecipeRatings);
    this.router.post("/addWorkshopRatings", this.addWorkshopRatings);
    this.router.post("/addBlogRatings", this.addBlogRatings);
    this.router.post("/getAllRatingsAndReviews", this.getAllRatingsAndReviews);
    this.router.post("/removeReciperating", this.removeRecipeRating)
    this.router.post("/removeWorkshopRating", this.removeWorkshopRating);
    this.router.post("/removeBlogRating", this.removeBlogRating);
    this.router.get('/average-rating', this.getAverageRating);
    this.router.get('/getRecipeRating/:id', this.getRecipeRatingStatus);
    this.router.get("/getworkshopRating/:id", this.getWorkshopRatingStatus);
    this.router.get("/getblogRating/:id", this.getBlogRatingStatus);
  }

  public async removeRecipeRating(req: Request, res: Response): Promise<void> {
    const { parent_id, recipe_ratings_id } = req.body;
    try {
      const ratingsReviewService = new RatingsReviewService();
      const removerating = await ratingsReviewService.removeRecipeRating(parent_id, recipe_ratings_id);
      res.status(200).json({ message: 'Recipe rating removed successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async getRecipeRatingStatus(req: any, res: any): Promise<any> {
    const recipeId = req.params.id;
    console.log(recipeId)
    try {
      const ratingsReviewService = new RatingsReviewService();
      const ratingInfo = await ratingsReviewService.getRecipeRatingStatus(recipeId);
      return res.status(200).json(ratingInfo);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async getWorkshopRatingStatus(req: any, res: any): Promise<any> {
    const workshopId = req.params.id;
    console.log(workshopId)
    try {
      const ratingsReviewService = new RatingsReviewService();
      const ratingInfo = await ratingsReviewService.getWorkshopRatingStatus(workshopId);
      return res.status(200).json(ratingInfo);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async getBlogRatingStatus(req: any, res: any): Promise<any> {
    const blogId = req.params.id;
    console.log(blogId)
    try {
      const ratingsReviewService = new RatingsReviewService();
      const ratingInfo = await ratingsReviewService.getBlogRatingStatus(blogId);
      return res.status(200).json(ratingInfo);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }


  public async removeWorkshopRating(req: Request, res: Response): Promise<void> {
    const { parent_id, workshop_ratings_id } = req.body;
    try {
      const ratingsReviewService = new RatingsReviewService();
      const removerating = await ratingsReviewService.removeWorkshopRating(parent_id, workshop_ratings_id);
      res.status(200).json({ message: 'Worskhop rating removed successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }


  public async removeBlogRating(req: Request, res: Response): Promise<void> {
    const { parent_id, blog_ratings_id } = req.body;
    try {
      const ratingsReviewService = new RatingsReviewService();
      const removerating = await ratingsReviewService.removeBlogRating(parent_id, blog_ratings_id);
      res.status(200).json({ message: 'Blog rating removed successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async getRecipeRating(req: Request, res: Response): Promise<void> {
    const ratingsReviewService = new RatingsReviewService();
    try {
      const ratingsAndReviews = await ratingsReviewService.getRecipeRatings();
      res.status(200).json(ratingsAndReviews);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async getWorkshopRating(req: Request, res: Response): Promise<void> {
    const ratingsReviewService = new RatingsReviewService();
    try {
      const ratingsAndReviews = await ratingsReviewService.getWorkshopRatings();
      res.status(200).json(ratingsAndReviews);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async getBlogRating(req: Request, res: Response): Promise<void> {
    const ratingsReviewService = new RatingsReviewService();
    try {
      const ratingsAndReviews = await ratingsReviewService.getBlogRatings();
      res.status(200).json(ratingsAndReviews);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async addRecipeRatings(req: Request, res: Response): Promise<void> {
    const { parent_id, recipe_info_id, recipe_review, recipe_rating } = req.body;
    let rID = decrypted(recipe_info_id) ? recipe_info_id : encrypted(recipe_info_id)
    const ratingsReviewService = new RatingsReviewService();
    try {
      const newRating = await ratingsReviewService.addRecipeRating(parent_id, rID, recipe_rating, recipe_review,);
      res.status(201).json(newRating);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async addWorkshopRatings(req: Request, res: Response): Promise<void> {
    const { parent_id, workshop_info_id, workshop_review, workshop_rating } = req.body;
    const ratingsReviewService = new RatingsReviewService();
    try {
      const newRating = await ratingsReviewService.addRecipeRating(parent_id, workshop_info_id, workshop_rating, workshop_review);
      res.status(201).json(newRating);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async addBlogRatings(req: Request, res: Response): Promise<void> {
    const { parent_id, blog_info_id, blog_review, blog_rating } = req.body;
    const ratingsReviewService = new RatingsReviewService();
    try {
      const newRating = await ratingsReviewService.addBlogRating(parent_id, blog_info_id, blog_rating, blog_review,);
      res.status(201).json(newRating);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async getAllRatingsAndReviews(req: Request, res: Response): Promise<void> {
    const parentId = decrypted(req.body.parentId);
    try {
      const ratingsReviewService = new RatingsReviewService();
      const ratings = await ratingsReviewService.getAllRatingsAndReviews(parentId);
      res.status(200).json(ratings);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  //  public async getTopRatedRecipesCount(req: Request, res: Response): Promise<void> {
  //   try {
  //     const ratingsReviewService = new RatingsReviewService();
  //     const count = await ratingsReviewService.getTopRatedRecipesCount();
  //     res.json(count);
  //   } catch (error) {
  //     console.error('Error fetching top-rated recipes count:', error);
  //     res.status(500).json({ error: 'Internal Server Error' });
  //   }
  // }

  public async getAverageRating(req: Request, res: Response): Promise<void> {
    try {
      const ratingsReviewService = new RatingsReviewService();
      const averageRating = await ratingsReviewService.getAverageRating();
      res.json({ averageRating });
    } catch (error) {
      console.error('Error fetching average rating:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  public async getTopRatedRecipesCount(req: Request, res: Response): Promise<void> {
    try {
      const ratingsReviewService = new RatingsReviewService();
      const ratingThreshold = 4.5;
      const topRatedCount = await ratingsReviewService.getTopRatedRecipesCount(ratingThreshold);
      res.json({ topRatedCount });
    } catch (error) {
      console.error('Error fetching top-rated recipes count:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}


