import { BlogcategoryInterface } from "../blog-category.interface";
import { BlogImageInterface } from "./blog-image.interface";

export type BlogInfoInterface = {
    blog_info_id: number;
    blog_title: string;
    blog_category: number;
    published_date: Date;
    author: string;
    content: string;
    blog_image?: BlogImageInterface[];
  };
   
  export interface RequestBlogInfoInterface{
    blog_title: string; 
    blog_category: number;
    published_date: Date;
    author: string;
    content: string;  
  };
