
import { CourseDesDBModel, CourseInfoDBModel, CourseSectionMarDBModel, CourseVideoDBModel, CourseEditDBModel, CourseImageDBModel, CourseSectionInfoDBModel, CourseSecTextDBModel } from "../../db-models";
import { Op } from "sequelize";
import model, { Model } from "sequelize/types/model";
import { RequestBodyInterface, CourseInfoInterface, RequestCourseDesInterface, RequestCourseSecInterface } from "../../interface";
import { decrypted, PostgresqlHelper, sequelize } from "../../helper";
import { CollectionResultModel } from "../../model";
import AppLogger from "../../helper/app-logger";
import { NotificationService } from "../notification.service";


export class CourseInfoService {
  value: string;
  self = this;
  constructor() {
  }


  public async getCourseInfo(
    requestBody: Partial<RequestBodyInterface>
  ): Promise<any> {
    const searchColumn = {
      'course_name': 'course_name',
      // 'published_date': 'published_date',
      'author': 'author',
      // 'subscription_type': 'subscription_type'
    };
    const sortColunm = {
      'course_name': 'course_name',
      // 'published_date': 'published_date',
      'author': 'author',
      // 'subscription_type': 'subscription_type'
    }
    const postresSqlHelper = new PostgresqlHelper();


    const getQueryData = postresSqlHelper.tableListQuery(
      searchColumn,
      requestBody,
      CourseInfoDBModel,
      sortColunm)
    return await CourseInfoDBModel.findAndCountAll(
      getQueryData
    )


      .then((data) => {
        return new CollectionResultModel(data, requestBody);
      })
      .catch((err) => {
        return err;
      });
  }

  public async getCourseInfoMob(
    requestBody: Partial<RequestBodyInterface>
  ): Promise<any> {
    const searchColumn = {
      'course_name': 'course_name',
      'author': 'author',
    };
    const sortColunm = {
      'course_name': 'course_name',
      'author': 'author',
    }
    const postresSqlHelper = new PostgresqlHelper();
    const getQueryData = postresSqlHelper.tableListQuery(
      searchColumn,
      requestBody,
      CourseInfoDBModel,
      sortColunm)
    getQueryData.include = [{
      model: CourseImageDBModel
    },]
    return await CourseInfoDBModel.findAndCountAll(
      getQueryData
    )


      .then((data) => {
        return new CollectionResultModel(data, requestBody);
      })
      .catch((err) => {
        return err;
      });
  }

  public async addCourseInfo(course: CourseInfoInterface): Promise<any> {
    const b = await CourseInfoDBModel.create({
      course_name: course.course_name,
      author: course.author,
      published_date: course.published_date,
      subscription_type: course.subscription_type,
      no_of_sections: course.no_of_sections,
      time_duration: course.time_duration,
    });
    (new NotificationService()).sendNotification({ id: b.course_info_id, contentName: b.course_name, moduleName: 'course', route: 'Courses' })
    return b
  }


  public async deleteCourseInfo(requestBody: any): Promise<any> {
    const courseAry = requestBody.map(ids => parseInt(decrypted(ids)))
    return await CourseInfoDBModel.findAll({
      where: { course_info_id: courseAry }
    }).then((ingredient) => {
      ingredient.forEach(val => {
        val.status = 'inactive';
        val.save()
      })
      return 'course is deleted successfully.'
    }).catch(err => {
      return 'course is not Deleted.!'
    });
  }

  public async updateCourseInfo(requestBody: any): Promise<any> {
    const course_info_id = parseInt(decrypted(requestBody.course_info_id));
    const t = await sequelize.getSequelize.transaction();
    try {
      const result = await Promise.all([
        CourseInfoDBModel.update({
          course_info_id: requestBody.course_info_id,
          course_name: requestBody.course_name,
          author: requestBody.author,
          published_date: requestBody.published_date,
          subscription_type: requestBody.subscription_type,
          no_of_sections: requestBody.no_of_sections,
          time_duration: requestBody.time_duration,
        }, {
          where: {
            course_info_id: course_info_id
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

  public async editCourseInfo(id): Promise<any> {
    return await CourseInfoDBModel.findOne({
      where: {
        course_info_id: decrypted(id),
      },
    });
  }


  public async getCourseDes(requestBody: Partial<RequestBodyInterface>): Promise<any> {
    const searchColumn = [
      "course_des"
    ];
    const postresSqlHelper = new PostgresqlHelper();
    const getQuery = postresSqlHelper.tableListQuery(
      searchColumn,
      requestBody,
      CourseDesDBModel)
    getQuery.include = [

    ]
    return await CourseDesDBModel.findAndCountAll(
      getQuery
    )
      .then((data) => {
        return new CollectionResultModel(data, requestBody);
      })
      .catch((err) => {
        return err;
      });
  }


  public async addCourseDes(course: RequestCourseDesInterface): Promise<any> {
    return await CourseDesDBModel.create({
      course_info_id: course.course_info_id,
      course_des: course.coursedes.course_des
    })
  }

  public async deleteCourseDes(requestBody: any): Promise<any> {
    const courseAry = requestBody.map(ids => parseInt(decrypted(ids)))
    return await CourseDesDBModel.findAll({
      where: { course_des_id: courseAry }
    }).then((des) => {
      des.forEach(val => {
        val.status = 'inactive';
        val.save()
      })
      return 'Course Description is deleted successfully.'
    }).catch(err => {
      return 'course is not Deleted.!'
    });
  }


  public async updateCourseDes(requestBody: any): Promise<any> {
    const course_des_id = parseInt(decrypted(requestBody.course_info_id));

    const des = await CourseDesDBModel.findOne({
      where: { course_info_id: course_des_id }
    })
    if (des) {
      return await CourseDesDBModel.update({
        course_des: requestBody.course_des
      },
        { where: { course_info_id: course_des_id } })
    } else {
      return await CourseDesDBModel.create({
        course_des: requestBody.course_des,
        course_info_id: course_des_id
      })
    }
  }

  public async editCourseDes(id): Promise<any> {
    return await CourseDesDBModel.findOne({
      where: {
        course_info_id: decrypted(id),
      },
    });
  }


  public async getAllCourseInfo(): Promise<any> {
    return await CourseInfoDBModel.findAll();
  }

  public async uploadImages(imageName: string,
    imageType: string,
    courseIds: number,
    typeQuery: string,
    imageId: number): Promise<any> {
    const imageTypes = {
      iconImg: 'icon_image',
      thumbnailImg: 'thumbnail_image',
      bannerImg: 'banner_image',
      courseMainImg: 'course_main_image'
    }
    const payLoad = {};
    payLoad['course_info_id'] = courseIds;
    payLoad[imageTypes[imageType]] = imageName
    if (typeQuery === 'create') {
      return await CourseImageDBModel.create(payLoad);
    } else {
      return await CourseImageDBModel.update(payLoad, {
        where: {
          course_image_id: imageId
        }
      })
    }

  }



  public async uploadVideos(videoName: string, courseIds: number, typeQuery: string, videoId: number): Promise<any> {
    const payLoad = {
      course_info_id: courseIds,
      video: videoName,
    };
    if (typeQuery === 'create') {
      return await CourseVideoDBModel.create(payLoad);
    } else {
      return await CourseVideoDBModel.update(payLoad, {
        where: {
          course_video_id: videoId
        }
      })
    }

  }


  public async getCourseSec(requestBody?: Partial<RequestBodyInterface>): Promise<any> {
    try {
      const sectionInfo = await CourseSectionInfoDBModel.findAll({
        include: [
          { model: CourseSecTextDBModel },
        ]
      })
      return sectionInfo
    }
    catch (e) {
      throw e
    }
   
  }


  public async addCourseSec(requestBody: any): Promise<any> {
    console.log(requestBody)
    const sections = Object.keys(requestBody.data);
    const course_sec_id = []
    for (const name of requestBody.section_name) {
      const sec = await CourseSectionInfoDBModel.create({
        course_info_id: requestBody.course_info_id,
        section_name: name
      });
      course_sec_id.push(sec.course_sec_id);
    }

    try {
      for (let i = 0; i < sections.length; i++) {
        for (let j = 0; j < requestBody.data[sections[i]].length; j++) {
          const secText = await CourseSecTextDBModel.create({
            course_sec_id: parseInt(decrypted(course_sec_id[i])),
            section_description: requestBody.data[sections[i]][j]
          })
        }
      }
    } catch (e) {
      console.log("This is error", e)
      throw e
    }
  }

  public async editAllCourses(id): Promise<any> {
    return await CourseEditDBModel.findAll({
      include: [
        { model: CourseDesDBModel },
        {
          model: CourseSectionInfoDBModel,
          include: [
            { model: CourseSecTextDBModel },
          ]
        },
        { model: CourseImageDBModel },
        { model: CourseVideoDBModel },
      ], where: {
        course_info_id: parseInt(decrypted(id)),
      },
    });
  }

  public async viewAllCoursesInfo(id?: string): Promise<any> {
    console.log(id, parseInt(decrypted(id)))
    try {
      return await CourseEditDBModel.findOne(
        {
          include: [
            { model: CourseDesDBModel },
            { model: CourseImageDBModel },
            { model: CourseVideoDBModel },
            {
              model: CourseSectionInfoDBModel,
              include: [
                { model: CourseSecTextDBModel },
              ]
            },
          ], where: {
            course_info_id: parseInt(decrypted(id)),
          },
        });
    }
    catch (e) {
      throw e
    }
  }
  public async addMar(reqbody: any): Promise<any> {
    return await CourseSectionMarDBModel.create({
      course_info_id: reqbody.course_info_id,
      course_sec_id: reqbody.course_sec_id,
      sec_text_id: reqbody.sec_text_id,
      parent_id: parseInt(decrypted(reqbody.parent_id)),
      mark_as_read: reqbody.mark_as_read
    })
  }

  public async getMar(reqbody: any): Promise<any> {
    return await CourseSectionMarDBModel.findOne({
      where: {
        parent_id: parseInt(decrypted(reqbody.parent_id)),
        course_info_id: reqbody.course_info_id,
        sec_text_id: reqbody.sec_text_id
      }
    })
  }
  public async updateImages(courseInfoId: number, newImageData: any): Promise<void> {
    try {
      const existingImageData = await CourseImageDBModel.findOne({
        where: { course_info_id: courseInfoId },
      });

      if (!existingImageData) {
        throw new Error('Course image data not found.');
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
      if (newImageData.courseMainImg) {
        updatedData.course_main_image = newImageData.courseMainImg;
      } else {
        updatedData.course_main_image = existingImageData.getDataValue('course_main_image');
      }
      if (newImageData.bannerImg) {
        updatedData.banner_image = newImageData.bannerImg;
      } else {
        updatedData.banner_image = existingImageData.getDataValue('banner_image');
      }
      await CourseImageDBModel.update(updatedData, {
        where: { course_info_id: courseInfoId },
      });
    } catch (error) {
      throw new Error('Error updating images: ' + error.message);
    }
  }

}
