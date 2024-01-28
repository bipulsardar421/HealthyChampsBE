import { BlogInfoDBModel } from "../../db-models/blog/blog-info-db.model";
import { BlogImageDBModel } from "../../db-models/blog/blog-image.db.model"
import { BlogcategoryDBModel } from "../../db-models/blog-category-db.model"
import { Op } from "sequelize";
import model, { Model } from "sequelize/types/model";
import { RequestBodyInterface, BlogInfoInterface, FilterBodyInterface } from "../../interface";
import { decrypted, PostgresqlHelper, sequelize } from "../../helper";
import { CollectionResultModel } from "../../model";
import AppLogger from "../../helper/app-logger";
import { BlogEditDBModel } from "../../db-models/blog/blog-edit-db.model"
import { NotificationService } from "..";
export class BlogInfoService {
  value: string;
  self = this;
  constructor() {
  }

  public async getBlogInfo(
    requestBody: Partial<RequestBodyInterface>
  ): Promise<any> {
    const searchColumn = {
      'blog_title': 'blog_title',
      'blog_category': 'blog_category',
      'published_date': 'published_date',
      'author': 'author'
    }
    const sortColunm = {
      'blog_title': 'blog_title',
      'blog_category': 'blog_category',
      'published_date': 'published_date',
      'author': 'author'
    }
    const postresSqlHelper = new PostgresqlHelper();
    const getQueryData = postresSqlHelper.tableListQuery(
      searchColumn,
      requestBody,
      BlogInfoDBModel,
      sortColunm)
    getQueryData.include = [{
      model: BlogcategoryDBModel
    },
    ]
    return await BlogInfoDBModel.findAndCountAll(
      getQueryData
    )
      .then((data) => {
        return new CollectionResultModel(data, requestBody);
      })
      .catch((err) => {
        return err;
      });
  }


  public async addBlogInfo(blog: BlogInfoInterface): Promise<any> {
    const b = await BlogInfoDBModel.create({
      blog_title: blog.blog_title,
      blog_category: blog.blog_category,
      published_date: blog.published_date,
      author: blog.author,
      content: blog.content,
    });
    (new NotificationService()).sendNotification({ id: b.dataValues.blog_info_id, contentName: b.dataValues.blog_title, moduleName: 'blogs', route: 'BlogList' })
    return b
  }


  public async editBlogInfo(id): Promise<any> {
    return await BlogInfoDBModel.findOne({
      where: {
        blog_info_id: decrypted(id),
      },
    });
  }

  public async getAllBlog(): Promise<any> {
    return await BlogInfoDBModel.findAll();
  }
  public async viewAllBlogsInfo(id?: string): Promise<any> {
    console.log(id, parseInt(decrypted(id)))
    return await BlogEditDBModel.findOne({
      include: [
        { model: BlogImageDBModel }
      ], where: {
        blog_info_id: parseInt(decrypted(id)),
      },
    });
  }

  public async deleteBlogInfo(requestBody: any): Promise<any> {
    const blogAry = requestBody.map(ids => parseInt(decrypted(ids)))
    return await BlogInfoDBModel.findAll({
      where: { blog_info_id: blogAry }
    }).then((ingredient) => {
      ingredient.forEach(val => {
        val.status = 'inactive';
        val.save()
      })
      return 'blog is deleted successfully.'
    }).catch(err => {
      return 'blog is not Deleted.!'
    });
  }

  public async updateBlogInfo(requestBody: any): Promise<any> {
    const blog_info_id = parseInt(decrypted(requestBody.blog_info_id));
    const t = await sequelize.getSequelize.transaction();
    try {
      const result = await Promise.all([
        BlogInfoDBModel.update({
          blog_info_id: requestBody.blog_info_id,
          blog_title: requestBody.blog_title,
          blog_category: requestBody.blog_category,
          published_date: requestBody.published_date,
          author: requestBody.author,
          content: requestBody.content
        }, {
          where: {
            blog_info_id: blog_info_id
          },
          transaction: t
        })

      ])

      await t.commit();
      return result

    } catch (error) {
      await t.rollback();
      return error;
    }

  }

  public async getAllBlogInfo(): Promise<any> {
    return await BlogInfoDBModel.findAll({
      include: [
        {
          model: BlogcategoryDBModel
        },
      ]
    }
    );
  }


  public async uploadImages(imageName: string,
    imageType: string,
    blogIds: number,
    typeQuery: string,
    imageId: number): Promise<any> {
    const imageTypes = {
      iconImg: 'icon_image',
      thumbnailImg: 'thumbnail_image',
      bannerImg: 'banner_image',
      blogMainImg: 'blog_main_image'
    }
    const payLoad = {};
    payLoad['blog_info_id'] = blogIds;
    payLoad[imageTypes[imageType]] = imageName
    if (typeQuery === 'create') {
      return await BlogImageDBModel.create(payLoad);
    } else {
      return await BlogImageDBModel.update(payLoad, {
        where: {
          blog_image_id: imageId
        }
      })
    }
  }

  public async updateImages(blogInfoId: number, newImageData: any): Promise<void> {
    try {
      const existingImageData = await BlogImageDBModel.findOne({
        where: { blog_info_id: blogInfoId },
      });

      if (!existingImageData) {
        throw new Error('Blog image data not found.');
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
      if (newImageData.blogMainImg) {
        updatedData.blog_main_image = newImageData.blogMainImg;
      } else {
        updatedData.blog_main_image = existingImageData.getDataValue('blog_main_image');
      }
      if (newImageData.bannerImg) {
        updatedData.banner_image = newImageData.bannerImg;
      } else {
        updatedData.banner_image = existingImageData.getDataValue('banner_image');
      }
      await BlogImageDBModel.update(updatedData, {
        where: { blog_info_id: blogInfoId },
      });
    } catch (error) {
      throw new Error('Error updating images: ' + error.message);
    }
  }
  public async editAllBlogs(id): Promise<any> {
    return await BlogEditDBModel.findAll({
      include: [
        { model: BlogImageDBModel },
      ], where: {
        blog_info_id: parseInt(decrypted(id)),
      },
    });
  }

  public async getAllBlogs(limit?: any): Promise<BlogInfoDBModel[]> {
    try {
      const blogs = await BlogInfoDBModel.findAll({
        include: [
          {
            model: BlogImageDBModel,
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
      return blogs;
    } catch (error) {
      throw new Error(`Unable to fetch blogs: ${error.message}`);
    }
  }

}


