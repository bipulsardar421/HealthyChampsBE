import { decrypted } from "../helper";
import { CourseInfoInterface, PodcastsInfoInterface } from "../interface";

export class CoursesModel {
    course_info_id: number;
    course_name: string;
    constructor(course: CourseInfoInterface) {
        this.course_info_id = course.course_info_id?parseInt(decrypted(course.course_info_id.toString())):0;
        this.course_name = course.course_name || '';
    }
}