import { PostgresqlHelper, encrypted } from "../helper";
import { BlogcategoryDBModel } from "../db-models/blog-category-db.model";
import { BlogcategoryInterface, RequestBodyInterface } from "../interface";
import { CollectionResultModel } from "../model";
import { BlogInfoDBModel } from "../db-models/blog/blog-info-db.model";
import { Op } from "sequelize";
import { BlogImageDBModel } from "../db-models";


interface RequestBlogcategory {
    blog_category: string
}


export class BlogcategoryService {


    constructor() { }

    public async getBlogcategoryList(requestBody: Partial<RequestBodyInterface>): Promise<CollectionResultModel<BlogcategoryInterface>> {
        const searchColumn = { 'blog_category': 'blogcategory' };
        const sortColumn = { 'blog_category': 'blogcategory' };
        const postresSqlHelper = new PostgresqlHelper();

        const blogcategories = await BlogcategoryDBModel.findAndCountAll(
            postresSqlHelper.tableListQuery(searchColumn, requestBody, BlogcategoryDBModel, sortColumn)
        );

        const blogcategoryListWithCount = await Promise.all(
            blogcategories.rows.map(async (blogcategory) => {
                const blogCount = await BlogInfoDBModel.count({
                    where: { blog_category: blogcategory.blog_category_id },
                    col: 'blog_title'
                });
                return {
                    ...blogcategory.toJSON(),
                    blogCount,
                };
            })
        );

        const result = new CollectionResultModel<BlogcategoryInterface>({
            ...blogcategories,
            rows: blogcategoryListWithCount,
        }, requestBody);

        return result;
    }


    public async getAllBlogCatById(blogcatId: any, pageNumber: number, pageSize: number, search: any): Promise<any> {
        try {
            let whereCondition: any = {
                blog_category: blogcatId,
            };

            if (search && search.searchText) {
                const searchText = search.searchText;
                whereCondition.blog_title = {
                    [Op.iLike]: `%${searchText}%`
                };
            }

            const blogs = await BlogInfoDBModel.findAll({
                where: whereCondition,
                offset: pageNumber * pageSize,
                limit: pageSize,
                attributes: ['blog_title', 'author', 'content', 'published_date', 'blog_category'],

                include: [
                    {
                        model: BlogcategoryDBModel,
                    },
                    {
                        model: BlogImageDBModel,
                        as: 'blogs_images',
                    },
                ],
            });

            blogs.forEach(blog => {
                if (blog.blogs_images) {
                    blog.blogs_images.forEach(image => {
                        if (image.blog_info_id) {
                            image.blog_info_id = encrypted(image.blog_info_id);
                        }
                    });
                }
            });

            return blogs;
        } catch (error) {
            throw new Error('Error fetching blog categories by ID: ' + error.message);
        }
    }



    public async addBlogCategory(requestBody: RequestBlogcategory): Promise<any> {
        return await BlogcategoryDBModel.create({
            blog_category: requestBody.blog_category
        });
    }


    public async deleteBlogcategory(requestBody: any): Promise<any> {
        return await BlogcategoryDBModel.update({
            status: 'inactive'
        }, {
            where: { blog_category_id: requestBody }
        });
    }
    public async updateBlogcategory(requestBody: any): Promise<any> {
        return await BlogcategoryDBModel.update({
            blog_category: requestBody.blog_category,

            status: 'active'
        }, {
            where: { blog_category_id: requestBody.blog_category_id }
        });
    }

    public async getAllBlogcategory(): Promise<any> {
        return await BlogcategoryDBModel.findAll({
            attributes: ['blog_category_id', 'blog_category'],
            where: {
                status: 'active'
            }
        });
    }
}




