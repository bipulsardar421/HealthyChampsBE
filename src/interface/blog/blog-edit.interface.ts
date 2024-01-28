import { BlogcategoryInterface }from "../blog-category.interface"
import { BlogImageInterface } from "./blog-image.interface";
export type BlogEditInterface = {
  blog_info_id: number;
  blog_title: string;
  blog_category: number;
  published_date: Date;
  author: string;
  content: string;
  };
   