import { CentreDBModel, CountryDBModel, MyProfileDBModel, MyProfileImageDBModel, ParentProfileImageDBModel, UserRolesDBModel, UserSignUpDBModel } from "../db-models";
import { PostgresqlHelper, decrypted } from "../helper";
import { RequestBodyInterface, RequestMyProfileInterface } from "../interface";
import { CollectionResultModel } from "../model";

export class UserProfileService {
    value: string;
    self = this;
    constructor() {
    }

    public async getUserProfile(requestBody: Partial<RequestBodyInterface>): Promise<any> {
        try {
            const postresSqlHelper = new PostgresqlHelper();
            const getQueryData = postresSqlHelper.tableListQuery(
                'searchColumn',
                requestBody,
                MyProfileDBModel,
            );

            getQueryData.include = [
                {
                    model: UserSignUpDBModel,
                    include: [ 
                        UserRolesDBModel,
                        CountryDBModel,
                    ]
                },
                // {
                //     model: UserRolesDBModel,
                // },
                // {
                //     model: CountryDBModel,
                // },
                {
                    model: CentreDBModel,
                },
                // {
                //     model: MyProfileImageDBModel,
                // },
            ];

            const data = await MyProfileDBModel.findAndCountAll(getQueryData);

            return new CollectionResultModel(data, requestBody);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }


    public async addUserProfile(user: RequestMyProfileInterface): Promise<any> {
        const userDetail: any = {
            user_signup_id: user.user_signup_id,
            // role_id: user.role_id,
            center: user.center,
            profile_image: user.profile_image
            // country: user.country,
            // mobile_number: user.mobile_number,
            // email_address: user.email_address,
        };
        return await MyProfileDBModel.create(userDetail)
    }

    public async editUserProfile(id): Promise<any> {
        return await MyProfileDBModel.findOne({
            where: {
                my_profile_id: decrypted(id),
            },
        });
    }
    public async deleteUserProfile(requestBody: any): Promise<any> {
        const userProf = requestBody.map(ids => parseInt(decrypted(ids)))
        return await MyProfileDBModel.findAll({
            where: { my_profile_id: userProf }
        }).then((ingredient) => {
            ingredient.forEach(val => {
                val.status = 'inactive';
                val.save()
            })
            return 'User profile deleted successfully.'
        }).catch(err => {
            return 'User Profile is not Deleted.!'
        });

    }

    // public async updateUserProfile(requestBody: any): Promise<any> {
    //     const my_profile_id = parseInt(decrypted(requestBody.user_signup_id));
    //     return await MyProfileDBModel.findOne({
    //         where: { my_profile_id: my_profile_id }
    //     }).then(UserList => {
    //         UserList.user_signup_id = requestBody.user_signup_id,
    //             // UserList.role_id = requestBody.role_id,
    //             // UserList.email_address = requestBody.email_address,
    //             // UserList.mobile_number = requestBody.mobile_number,
    //             // UserList.country = requestBody.country,
    //             UserList.center = requestBody.center,
    //             UserList.profile_image = requestBody.profile_image
    //             UserList.status = 'active';
    //         UserList.save();
    //         return 'User is Updated successfully.'
    //     }).catch(error => {
    //         return 'User Updated failed.!'
    //     });
    // }
    public async updateUserProfile(requestBody: any): Promise<any> {
        try {
          const userSignupId = requestBody.user_signup_id
          const updatedProfile = await MyProfileDBModel.findOne({
            where: { user_signup_id: userSignupId },
          });
      
          if (updatedProfile) {
            updatedProfile.center = requestBody.center;
            updatedProfile.profile_image = requestBody.profile_image;
            updatedProfile.status = 'active';
            await updatedProfile.save();
      
            const userSignUp = await UserSignUpDBModel.findOne({
              where: { user_signup_id: userSignupId },
            });
      
            if (userSignUp) {
              userSignUp.country = requestBody.country;
              userSignUp.email_address = requestBody.email_address;
              userSignUp.mobile_number = requestBody.mobile_number;
              await userSignUp.save();
            }
            return 'User Profile is Updated successfully.';
          } else {
            return 'User Profile not found.';
          }
        } catch (error) {
          console.error('Error updating user profile:', error);
          return 'An error occurred while updating the user profile.';
        }
      }
      
      
      
    public async uploadImages(
        imageName: string,
        imageType: string,
        profileIds: string,
        typeQuery: string,
        imageId: string
    ): Promise<any> {
        const imageTypes = {
            profileImg: 'profile_image',
        };

        const payLoad = {};
        payLoad['my_profile_id'] = decrypted(profileIds);
        payLoad[imageTypes[imageType]] = imageName;
        const decryptedImageId = decrypted(imageId);

        if (typeQuery === 'create') {
            console.log('create');

            return await MyProfileImageDBModel.create(payLoad);
        } else {
            try {
                console.log('update');

                return await MyProfileImageDBModel.update(payLoad, {
                    where: {
                        profile_image_id: imageId
                    }
                });
            } catch (err) {
                console.error(err);
                throw err;
            }
        }
    }


    public async updateImages(profileId: number, newImageUrl: string): Promise<void> {
        try {
            const existingProfile = await MyProfileDBModel.findOne({
                where: { my_profile_id: profileId },
            });

            if (!existingProfile) {
                throw new Error('User profile not found.');
            }
            await MyProfileImageDBModel.update(
                {
                    image_url: newImageUrl,
                },
                {
                    where: { my_profile_id: profileId },
                }
            );
        } catch (error) {
            throw new Error('Error updating images: ' + error.message);
        }
    }
}


