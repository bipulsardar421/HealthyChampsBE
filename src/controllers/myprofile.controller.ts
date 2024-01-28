import { Router, Request, Response } from "express";
import { AppRoute } from "../app-route";
import { Api, decrypted,  PostgresqlHelper } from "../helper";
import * as multer from "multer";
import * as path from 'path';
import AppLogger from "../helper/app-logger";
import { UserProfileService } from "../services";
import * as fs from 'fs';

export class MyProfileController implements AppRoute {
route = "/user_profile"
 router: Router = Router();

  private readonly DIR = './src/upload/user_profile/images';
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
   constructor() {
     this.router.post("/getUserProfile", this.getUserProfile);
     this.router.post("/addUserProfile", this.addUserProfile);
     this.router.put("/deleteUserProfile", this.deleteUserProfile);
     this.router.get("/editUserProfile/:id", this.editUserProfile);
     this.router.put("/updateUserProfile", this.updateUserProfile);

    this.router.post("/uploadImage", this.upload.single('user_profile'), this.uploadImage);
    this.router.post("/updateImage", this.upload.single('user_profile'), this.updateImage);
    this.router.post("/updateImageName", this.updateImages);
    this.router.delete("/deleteUserProfileImage/:imageName", this.deleteUserProfileImage);
   }

   public updateImage(req, res) {
    const imageName = req.files[0].filename;
    res.json({ imageName })
  }

  public async updateImages(req: Request, res: Response): Promise<void> {
    const { profileId, newImageUrl } = req.body;
    try {
      const userProfileService = new UserProfileService();
      await userProfileService.updateImages(profileId, newImageUrl);
      res.json({ message: 'Images Updated Successfully' });
    } catch (error) {
      console.error('Error updating images:', error);
      res.status(500).json({ error: 'Error updating images.' });
    }
  }

  public async uploadImage(req, res, next): Promise<any> {
    try {
      const _userProfileService = new UserProfileService();
      console.log(req.body.uploadImageId)
      const queryType = req.body.uploadImageId !== 'null' ? 'update' : 'create';
      console.log(req.body, queryType)
      await _userProfileService.uploadImages(
        req.files[0].filename,
        req.body.image_type,
        req.body.myprofile_id,
        queryType,
        decrypted(req.body.uploadImageId))
        .then(val => { Api.ok(req, res, { message: 'success', images: val.dataValues }) })
    }
    catch (error) {
      Api.badRequest(req, res, {
        message: 'failed',
        error: error
      })
    }
  }
   public async getUserProfile(req: any, res: any): Promise<any> {
    const _userProfileService = new UserProfileService();
    try {
      await _userProfileService
        .getUserProfile(req.body)
        .then((data) => {
          return res.jsonp(data);
        });
    }
    catch (err) {
      console.error(err);
    }
  }

  public async addUserProfile(req: any, res: any): Promise<any> {
    try {
        const _userProfileService = new UserProfileService();
      await _userProfileService.addUserProfile(req.body)
        .then((profileId) => {
          Api.ok(req, res, {
            message: 'Success',
            userProfile: profileId['dataValues']
          })
        })
    } catch (error) {
      AppLogger.error('user profile add', error)
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

  public async editUserProfile(req, res): Promise<any> {
    const _userProfileService = new UserProfileService();
    const getUserProfileList = await _userProfileService
     .editUserProfile(req.params.id)
      .then((data) => {
        return res.jsonp(data);
      });
  }

  public async updateUserProfile(req, res): Promise<any> {
    console.log('annn', req.body)
    try {
      const _userProfileService = new UserProfileService();
      await _userProfileService
        .updateUserProfile(req.body)
        .then((getUserProfileList) => {
          Api.ok(req, res, {
            message: "User Profile updated successfully.",
          });
        })
    } catch (error) {
      AppLogger.error("deleted UserProfile", error);
      Api.invalid(req, res, {
        message: "User Profile update Failed.",
      });
    }
  }

  public async deleteUserProfile(req, res): Promise<any> {
    const usersignupservice = new UserProfileService();
    await usersignupservice
      .deleteUserProfile(req.body.my_profile_id)
      .then((ingredientList) => {
        Api.ok(req, res, {
          message: "User Profile deleted successfully.",
        });
      })
      .catch((error) => {
        AppLogger.error("deletedUser Profile", error);
        Api.invalid(req, res, {
          message: "User Profile deleted Failed.",
        });
      });
  }
  public async deleteUserProfileImage(req: Request, res: Response): Promise<any> {
    const imageName = req.params.imageName;
    try {
      // const ps = new UserProfileService();
      // await ps.deleteImg(imageName)

      fs.unlink(`./src/upload/user_profile/images/${imageName}`, async (err) => {
        if (err) {
          console.error(err);
          return Api.badRequest(req, res, { message: `${imageName} is not deleted` });
        }
        Api.ok(req, res, { message: `Deleted ${imageName} is successfully.` });
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
    }
  }
}