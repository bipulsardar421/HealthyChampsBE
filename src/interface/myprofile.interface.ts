import { MyProfileImageInterface } from "./myprofile-image.interface";

export type MyProfileInterface = {
    my_profile_id: number;
    user_signup_id: number;
    // role_id: number;
    center: number;
    // country: number;
    // mobile_number: string;
    // email_address: string;
    profile_image: string;
  //   profile_image : MyProfileImageInterface,
  }

  export type RequestMyProfileInterface = {
    user_signup_id: number;
    // role_id: number;
    center: number;
    // country: number;
    // mobile_number: string;
    // email_address: string;
    profile_image: string;
    // profile_image : MyProfileImageInterface, 
  }