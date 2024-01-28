export interface CourseDesInterface {
    course_des_id:number,
    course_info_id: number,
    course_des: string
}


export interface DesInterface {
    course_des: string,
}


export interface RequestCourseDesInterface{
    course_info_id: number,
    course_des: number,
    coursedes: DesInterface,
}
