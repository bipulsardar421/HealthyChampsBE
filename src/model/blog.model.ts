import { BlogImageInterface, BlogInfoInterface, WorkshopCredInterface, WorkshopInfoInterface } from "../interface";

export class BlogEditModel {
    blog_title: string = '';
    blog_category: number = 0;
    published_date: Date = new Date();
    author: string = '';
    content: string = '';
    blogs_images: BlogImageInterface[] = [];

    public static create(blogInfo?: BlogInfoInterface): BlogEditModel {
        return new BlogEditModel(blogInfo)
    }

    constructor(blogInfo?: BlogInfoInterface) {
        if (blogInfo) {
            this._intFormObj(blogInfo);
        }
    }

    protected _intFormObj(blogInfo?: BlogInfoInterface) {
        console.log(blogInfo);
        Object.assign(this, blogInfo);
    }
}