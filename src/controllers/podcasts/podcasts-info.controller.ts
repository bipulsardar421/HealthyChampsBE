import { Router,Request, Response } from "express";
import * as createCsvWriter from "csv-writer";
import { AppRoute } from "../../app-route";
import AppLogger from "../../helper/app-logger";
import { Api, decrypted, PostgresqlHelper } from "../../helper";
import { Sequelize } from "sequelize-typescript";
import { PodcastsInfoService } from "../../services/podcasts/podcasts-info.service";
import * as multer from 'multer';
import * as path from 'path';
import { PodcastsEditModel } from "../../model/podcasts-edit.model";
import { log } from "console";
import { EpisodeInfo, Payload, RequestPodEpiInterface } from "src/interface";
import * as fs from 'fs';
import { request } from "http";




export class PodcastsInfoController implements AppRoute {
  route = "/podcasts_info";
  router: Router = Router(); 

  private readonly DIR = './src/upload/podcasts/images';
  private readonly strorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, this.DIR)
    },
    filename: (req, file, cb) => {
      const fileName = file.fieldname.toLocaleLowerCase().split(' ').join('-') + '-' + Date.now() + path.extname(file.originalname);
      console.log(fileName)
      cb(null, fileName)
    }
  });
  private readonly upload = multer({
    storage: this.strorage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
    }
  })

  private readonly DIR2 = './src/upload/podcasts/videos';
  private readonly strorage2 = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, this.DIR2)
    },
    filename: (req, file, cb) => {
      const fileName = file.fieldname.toLocaleLowerCase().split(' ').join('-') + '-' + Date.now() + path.extname(file.originalname);
      console.log(fileName)
      cb(null, fileName)
    }
  });
  private readonly upload2 = multer({
    storage: this.strorage2,
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "video/mp4" || file.mimetype == "video/ogg" || file.mimetype == "video/webm") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .mp4, .ogg and .webm format allowed!'));
      }
    }
  })

  private readonly DIR3 = './src/upload/podcasts/audio';
  private readonly strorage3 = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, this.DIR3)
    },
    filename: (req, file, cb) => {
      const fileName = file.fieldname.toLocaleLowerCase().split(' ').join('-') + '-' + Date.now() + path.extname(file.originalname);
      console.log(fileName)
      cb(null, fileName)
    }
  });
  private readonly upload3 = multer({
    storage: this.strorage3,
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "audio/mp3" || file.mimetype == "audio/mpeg" || file.mimetype == "audio/aac") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .mp4, .ogg and .webm format allowed!'));
      }
    }
  })

  constructor() {
    this.router.post("/getPodcastsInfo", this.getPodcastsInfo);
    this.router.get("/editPodcastsInfo/:id", this.editPodcastsInfo);
    this.router.post("/addPodcastsInfo", this.addPodcastsInfo);
    this.router.post("/getEpisodeByPodcastInfo/:id", this.getEpisode);
    this.router.post("/addEpisode", this.addEpisode);
    this.router.put("/updatePodcastsInfo", this.updatePodcastsInfo);
    this.router.put("/deletePodcastsInfo", this.deletePodcastsInfo);
    this.router.get("/viewPodcastsInfo/:id", this.viewAllPodcastsInfo);
    this.router.get("/downloadcsvPodcastsInfo/", this.downloadCSV);
    
    this.router.post("/getPodcastsDes", this.getPodcastsDes);
    this.router.get("/editPodcastsDes/:id", this.editPodcastsDes);
    this.router.post("/addPodcastsDes", this.addPodcastsDes);
    this.router.put("/updatePodcastsDes", this.updatePodcastsDes);
    this.router.put("/deletePodcastsDes", this.deletePodcastsDes);

    this.router.post("/uploadImage", this.upload.array('podcasts', 6), this.uploadImage);
    this.router.post("/updateImage", this.upload.array('podcasts', 6), this.updateImage);
    this.router.post("/updateImageName", this.updateImages);
    
    this.router.post("/uploadVideo", this.upload2.single('podcasts'), this.uploadVideo);
    this.router.post("/uploadAudio", this.upload3.single('podcasts'), this.uploadAudio);

    this.router.get("/editPodcasts/:id", this.editAllPodcasts);

    this.router.delete("/deletePodcastsImage/:imageName", this.deletePodcastsImage);
    this.router.delete("/deletePodcastsVideo/:videoName", this.deletePodcastsVideo);
    this.router.get('/getAllPodcasts', this.getAllPodcasts);
    }

    public updateImage(req, res) {
      const imageName = req.files[0].filename;
      res.json({ imageName })
    }

    public async updateImages(req: Request, res: Response): Promise<void> {
      const { podcastId, imgData } = req.body;
      try {
        const podcastsInfoService = new PodcastsInfoService();
        await podcastsInfoService.updateImages(podcastId, imgData);
        res.json({ message: 'Images Updated Successfully' });
      } catch (error) {
        console.error('Error updating images:', error);
        res.status(500).json({ error: 'Error updating images.' });
      }
    }
  

public async getEpisode(req:Request, res: Response): Promise<void> {
  const _podcastsinfoService = new PodcastsInfoService();
  const episodeId = req.params.id;
  await _podcastsinfoService
    .getEpisodeInfo(episodeId)
    .then((data) => {
      return res.jsonp(data);
    });
}

public async getAllPodcasts(req: Request, res: Response): Promise<void> {
  const podcastsInfoService = new PodcastsInfoService();
  const limit = req.query.limit; 
  const podcasts = await podcastsInfoService.getAllPodcasts(limit);
  res.json(podcasts);
}

  public async getPodcastsInfo(req: any, res: any): Promise<any> {
    const _podcastsinfoService = new PodcastsInfoService();
    await _podcastsinfoService
      .getPodcastsInfo(req.body)
      .then((data) => {
        return res.jsonp(data);
      });
  }

  public async getPodcastsDes(req: any, res: any): Promise<any> {
    const _podcastsinfoService = new PodcastsInfoService();
    await _podcastsinfoService
      .getPodcastsDes(req.body)
      .then((data) => {
        return res.jsonp(data);
      });
  }

  public async editPodcastsInfo(req: any, res: any): Promise<any> {
    const _podcastsService = new PodcastsInfoService();
    const getPodcastsInfoList = await _podcastsService
      .editPodcastsInfo(req.params.id)
      .then((data) => {
        return res.jsonp(PodcastsEditModel.create(data));
      })
  }

  public async addPodcastsInfo(req: any, res: any): Promise<any> {
    try {
      const _podcastsinfoService = new PodcastsInfoService();
      await _podcastsinfoService.addPodcastsInfo(req.body)
        .then((podcastsId) => {
          Api.ok(req, res, {
            message: 'Success',
            podcasts: podcastsId['dataValues']

          })
        })
    } catch (error) {
      AppLogger.error('podcasts add', error)
      if (error.name === 'SequelizeValidationError') {
        Api.invalid(req, res, {
          message: error.errors[0].message
        })
      } else {
        Api.badRequest(req, res, {
          errorCode: 500,
          message: 'Error'
        })
      }
    }
  }

  public async addPodcastsDes(req: any, res: any): Promise<any> {
    try {
      const _podcastsinfoService = new PodcastsInfoService();
      await _podcastsinfoService.addPodcastsDes(req.body)
        .then((podcastsId) => {
          Api.ok(req, res, {
            message: 'Success'
          })
        })
    } catch (error) {
      AppLogger.error('podcasts add', error)
      if (error.name === 'SequelizeValidationError') {
        Api.invalid(req, res, {
          message: error.errors[0].message
        })
      } else {
        Api.badRequest(req, res, {
          errorCode: 500,
          message: 'Error'
        })
      }
    }
  }



  public async updatePodcastsInfo(req, res): Promise<any> {
    try {
      const podcastsinfoService = new PodcastsInfoService();
      await podcastsinfoService
        .updatePodcastsInfo(req.body)
        .then((podcastsList) => {
          if (podcastsList.name === 'SequelizeValidationError') {
            Api.invalid(req, res, {
              message: podcastsList.errors[0].message
            })
          } else {
            Api.ok(req, res, {
              message: "podcasts updated successfully",
            });
          }

        })
    }
    catch (error) {
      AppLogger.error('podcasts updated', error)
      if (error.name === 'SequelizeValidationError') {
        Api.invalid(req, res, {
          message: error.errors[0].message
        })
      } else {
        Api.badRequest(req, res, {
          errorCode: 500,
          message: 'podcasts updated Failed.'
        })
      }
    }
  }
  public async updatePodcastsDes(req, res): Promise<any> {
    try{
      const podcastsinfoServices = new PodcastsInfoService();
      await podcastsinfoServices
        .updatePodcastsDes(req.body)
        .then((podcastsList) => {
          Api.ok(req, res, {
            message: "podcast description updated successfully",
          });
        })
    } catch (error) {
      console.log(error)
      AppLogger.error("updated podcasts", error);
      Api.invalid(req, res, {
        message: "podcasts description updated Failed.",
      });
    }
  }


  public async deletePodcastsInfo(req, res): Promise<any> {
    try {
      const podcastsinfoServices = new PodcastsInfoService();
      await podcastsinfoServices
        .deletePodcastsInfo(req.body.podcasts_info_id)
        .then((podcastsList) => {
          Api.ok(req, res, {
            message: "Podcasts deleted successfully.",
          });
        })
    } catch (error) {
      AppLogger.error("deletedPodcasts", error);
      Api.invalid(req, res,
        {
          message: "Podcasts deleted Failed.",
        });
    }
  }

  public async deletePodcastsDes(req, res): Promise<any> {
    try {
      const podcastsinfoServices = new PodcastsInfoService();
      await podcastsinfoServices
        .deletePodcastsDes(req.body.podcasts_des_id)
        .then((podcastsDesList) => {
          Api.ok(req, res, {
            message: "Podcasts deleted successfully.",
          });
        })
    } catch (error) {
      AppLogger.error("deletedPodcasts", error);
      Api.invalid(req, res,
        {
          message: "Podcasts deleted Failed.",
        });
    }
  }

  public async editPodcastsDes(req: any, res: any): Promise<any> {
    const _podcastsService = new PodcastsInfoService();
    const gePodcastsInfoList = await _podcastsService
      .editPodcastsDes(req.params.id)
      .then((data) => {
        return res.jsonp(data);
      });
  }

  public async uploadImage(req, res, next): Promise<any> {
    try {
      const _podcastsinfoService = new PodcastsInfoService();
      const reqFiles = []
      const url = req.protocol + '://' + req.get('host');
      console.log(req.body.uploadImageId)
      const queryType = req.body.uploadImageId !== 'null' ? 'update' : 'create';
      console.log(req.body, queryType)
      await _podcastsinfoService.uploadImages(req.files[0].filename, req.body.image_type,
        parseInt(req.body.podInfo_id), queryType,
        parseInt(req.body.uploadImageId))
        .then(val => { Api.ok(req, res, { message: 'success', images: val.dataValues }) })
    }
    catch (error) {
      Api.badRequest(req, res, {
        message: 'failed', error: error
      })
    }
  }

  public async uploadAudio(req, res) {
    try {
      const fileName = req.file.filename;
      res.json({ fileName });
    } catch (error) {
      res.status(500).json({ error: 'Failed to upload audio file' });
    }
  }

  public async addEpisode(req, res) {
    try {
      const payload = req.body;
      const episodesMap = new Map();
      payload.params.forEach((item) => {
        const episodeArray = item.formArray;
        const episodeName = item.episodeName;
        const podcasts_info_id = payload.pdodcastId;
        if (episodesMap.has(episodeName)) {
          const existingEpisode = episodesMap.get(episodeName);
          existingEpisode.formArray.push(...episodeArray);
        } else {
          episodesMap.set(episodeName, {
            episodeName,
            formArray: [...episodeArray],
            podcasts_info_id,
          });
        }
      });
      const episodes = Array.from(episodesMap.values());
      const _podcastsService = new PodcastsInfoService();
      await _podcastsService.addEpisodes(episodes);
      res.status(200).json({ message: 'Episodes received successfully', episodes });
    } catch (error) {
      console.error('Error handling episodes:', error);
      res.status(500).json({ message: 'Failed to handle episodes' });
    }
  }
  
  
  
  
  
  
  

  public async downloadCSV(req: any, res: any): Promise<any> {
    try {
      const _podcastsService = new PodcastsInfoService();
      const _helper = new PostgresqlHelper();
      await _podcastsService
        .getAllPodcastsInfo()
        .then((data) => {
          const fields = [
            {
              label: "podcasts_info_id",
              value: (row, field) => decrypted(row[field.label]),
            },
            {
              label: "Podcast Title",
              value: "podcast_title",
            },
            {
              label: "Time Duration",
              value: "time_duration",
            },
            {
              label: "No of Episodes",
              value: "no_of_episodes",
            },
            {
              label: "Subscription Type",
              value: "subscription_type",
            }
          ];
          const FileDetails = {
            contentType: "text/csv",
            fileName: "Podcasts.csv",
            csv: _helper.downloadResouce(fields, data),
          };
          if (
            FileDetails &&
            FileDetails.contentType === "text/csv" &&
            FileDetails.csv
          ) {
            res.setHeader(
              "content-disposition",
              `attachment; filename=${FileDetails.fileName}`
            );
            res.setHeader("Content-Type", "text/csv");
            res.attachment(FileDetails.fileName);
            return res.status(200).send(FileDetails.csv);
          }


          res.set("Content-Type", "application/json");
          res.type("json");
          const body = {
            success: true,
            code: 200,
            data: FileDetails,
          };
          res.status(200).send(body);
        })
    } catch (e) {
      res.status(400).send({
        success: false,
        code: 400,
        error: {
          description: e?.errors?.customsCode?.message || e.message,
        },
      });
    }
  }

  // public async uploadVideo(req, res, next): Promise<any> {
  //   const courseinfoService = new PodcastsInfoService();
  //   const url = req.protocol + '://' + req.get('host');
  //   console.log(req.file)
  //   await courseinfoService.uploadVideos(req.file.filename, parseInt(req.body.podcastsInfo_id));
  //   Api.ok(req, res, {
  //     video: req.file.filename,
  //   });
  // }
  public async uploadVideo(req, res, next): Promise<any> {
    const _podcastsService = new PodcastsInfoService();
    const url = req.protocol + '://' + req.get('host');
    const queryType = req.body.podcastsVideo_id !== 'null' ? 'update' : 'create';
    await _podcastsService.uploadVideos(req.file.filename, parseInt(req.body.podcastsInfo_id), queryType, parseInt(req.body.podcastsVideo_id))
      .then(val => { Api.ok(req, res, { message: 'success', video: val.dataValues }) });
  }
  public async editAllPodcasts(req: any, res: any): Promise<any> {
    const _podcastsService = new PodcastsInfoService();
    const getPodcastsInfoList = await _podcastsService
      .editAllPodcasts(req.params.id)
      .then((data) => {
        return Api.ok(req, res, data.map(list => PodcastsEditModel.create(list.dataValues)));
      });
  }

  public async viewAllPodcastsInfo(req, res: any): Promise<any> {
    const _podcastsService = new PodcastsInfoService();
    await _podcastsService.viewAllPodcastsInfo(req.params.id)
      .then(data => Api.ok(req, res, data))
      .catch(err => Api.badRequest(req, res, err))
  }

  public async deletePodcastsImage(req: Request, res: Response): Promise<void> {
    const imageName = req.params.imageName;
    try {
      fs.unlink(`./src/upload/podcasts/images/${imageName}`, (err) => {
        if (err) {
          console.error(err);
          return Api.badRequest(req, res, {message: `${imageName} is not deleted`});
        }
        Api.ok(req, res, {message: `Deleted ${imageName} is successfully.`});
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  }

  public async deletePodcastsVideo(req: Request, res: Response): Promise<void> {
    const videoName = req.params.videoName;
    try {
      fs.unlink(`./src/upload/podcasts/videos/${videoName}`, (err) => {
        if (err) {
          console.error(err);
          return Api.badRequest(req, res, {message: `${videoName} is not deleted`});
        }
        Api.ok(req, res, {message: `Deleted ${videoName} is successfully.`});
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  }
}

