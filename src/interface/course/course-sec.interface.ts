export interface CourseSecInterface {
    course_sec_id: number;
    course_info_id: number;
    section_name: string;
}

export interface CourseSecTextInterface {
    sec_text_id: number;
    section_description: string;

}

// export interface CourseSecImageInterface {
//     sec_image_id: number;
//     course_sec_id: number;
//     section_image: string;

// }

export interface SecInterface {
    sec_content: string,
}


export interface RequestCourseSecInterface{
    course_sec_id: number;
    course_info_id: number;
    section_name: string;
    section_description: CourseSecTextInterface;
    // section_image: CourseSecImageInterface;
}
