import { timingSafeEqual } from "crypto";
import { Router } from "express";
import path = require("path");
import { AppRoute } from "./app-route";

import {
  AgeGroupController,
  AllergenController,
  CentreController,
  DietaryController,
  IngredientController,
  MealTypeController,
  NutritionController,
  RoleUserController,
  ServingsController,
  ParentInfoController,
  ChildInfoController,
  BlogCategoryController,
  AccountController,
  RecipeInfoController,
  UserSignUpController,
  FormController,
  MeasurementController,
  WorkshopInfoController,
  SubscriptionController,
  helpandsupportController,
  CountryController,
  TermsandconditionsController,
  LoginController,
  RatingsReviewController,
  WishlistController,
  NotificationController,
  GenericSearchController,
} from "./controllers";

import {
  IngredientCategoryController,
  FoodCategoryController,
  SupplierController,
  NutritionCategoryController,   
} from "./controllers";
import { CourseInfoController } from "./controllers/course/course-info.controller";
import { HighlyNutritionalController } from "./controllers/highly-nutritional-controller";
import { PodcastsInfoController } from "./controllers/podcasts/podcasts-info.controller";
import { UserRolesControll } from "./controllers/user-roles.controller";
import { SubscriptionAppController } from "./controllers/subscription-app.controller";
import { MealPlanController } from "./controllers/mealplan/mealplan.controller";
import {BlogInfoController} from "./controllers/blog/blog-info.controller";
import { FeedbackController } from "./controllers/feedback.controller";
import { MyProfileController } from "./controllers/myprofile.controller";
export class AppRouting {
  constructor(private route: Router) {
    this.route = route;
    this.configure();
  }

  public configure() {
    this.addRoute(new ServingsController());
    this.addRoute(new AllergenController());
    this.addRoute(new DietaryController());
    this.addRoute(new IngredientController());
    this.addRoute(new IngredientCategoryController());
    this.addRoute(new SupplierController());
    this.addRoute(new FoodCategoryController());
    this.addRoute(new MealPlanController());
    this.addRoute(new NutritionController());
    this.addRoute(new CentreController());
    this.addRoute(new AgeGroupController());
    this.addRoute(new RoleUserController());
    this.addRoute(new HighlyNutritionalController());
    this.addRoute(new MealTypeController());
    this.addRoute(new ParentInfoController());
    this.addRoute(new WorkshopInfoController());
    this.addRoute(new ChildInfoController());
    this.addRoute(new BlogCategoryController());
    this.addRoute(new AccountController());
    this.addRoute(new RecipeInfoController());
    this.addRoute(new UserSignUpController());
    this.addRoute(new UserRolesControll());
    this.addRoute(new NutritionCategoryController());
    this.addRoute(new FormController());
    this.addRoute(new MeasurementController());
    this.addRoute(new PodcastsInfoController());
    this.addRoute(new CourseInfoController());
    this.addRoute(new SubscriptionController());
    this.addRoute(new SubscriptionAppController());
    this.addRoute(new helpandsupportController());
    this.addRoute(new MealPlanController());
    this.addRoute(new BlogInfoController());
    this.addRoute(new CountryController());
    this.addRoute(new TermsandconditionsController());
    this.addRoute(new FeedbackController());
    this.addRoute(new LoginController());
    this.addRoute(new RatingsReviewController());
    this.addRoute(new WishlistController());
    this.addRoute(new NotificationController());
    this.addRoute(new GenericSearchController());
    this.addRoute(new MyProfileController());
  }

  private addRoute(appRoute: AppRoute) {
    this.route.use(appRoute.route, appRoute.router);
  }
}
