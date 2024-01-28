import {
    CourseDesInterface,
    CourseImageInterface,
    CourseInfoInterface,
    CourseVideoInterface,
    RequestCourseInfoInterface,
} from "../interface";

export class CourseEditModel {
    course_info_id: number = 0;
    course_name: string='';
    author: string='';
    published_date: Date= new Date();
    subscription_type: boolean=false;
    no_of_sections: number=0;
    time_duration: string='';
    status: string = 'active';
    user_id: number = 0;
    course_des: CourseDesInterface[] = [];
    course_images: CourseImageInterface[]=[];
    course_videos: CourseVideoInterface[]=[];

    public static create(courseInfo?: CourseInfoInterface): CourseEditModel {
        return new CourseEditModel(courseInfo)
    }

    constructor(courseInfo?: RequestCourseInfoInterface) {
        if (courseInfo) {
            this._intFormObj(courseInfo);
        }
    }

    protected _intFormObj(courseInfo?: RequestCourseInfoInterface) {
        console.log(courseInfo);
        Object.assign(this, courseInfo);
    }
}