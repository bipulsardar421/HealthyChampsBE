import { CourseDesInterface } from "./course-des.interface";

export type CourseInfoInterface = {
    course_info_id: number;
    course_name: string;
    author: string;
    published_date: Date;
    subscription_type: boolean;
    no_of_sections: number;
    time_duration: string;
    course_des?: CourseDesInterface[];
  };
    
  export interface RequestCourseInfoInterface{
    course_name: string;
    author: string;
    published_date: Date;
    subscription_type: boolean;
    no_of_sections: number;
    time_duration: string;
  };

