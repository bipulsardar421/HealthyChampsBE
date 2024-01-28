import { ParentImageInterface } from "./parent-image.interface";

export type ParentInfoInterface = {
    parent_id: number | string,
    first_name: string,
    last_name: string,
    email_address: string,
    country: number,
    country_code: number,
    mobile_number: string,
    centre: number,
    password : string,
    login_orgin: string;
    temp_pass: boolean
    existing_parent: boolean,
    parent_image: ParentImageInterface,
  };

    export type RequestParentInfoInterface  = {
      first_name: string,
      last_name: string,
      email_address: string,
      country: number,
      country_code:number,
      mobile_number:string,
      centre: number,
      password :string,
      login_orgin: string;
      temp_pass: boolean
      existing_parent: boolean,
      parent_image: ParentImageInterface,
  };