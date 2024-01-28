export interface UserSignUpInterface {
    user_signup_id: string | number,
    first_name: string,
    last_name: string,
    email_address: string,
    mobile_number: string,
    password: string,
    timezone: Date,
    role_id: number,
    country: number,
    temp_pass: boolean
   // center: number,
  };

  export interface RequestUserSignUpInterface {
    first_name: string,
    last_name: string,
    email_address: string,
    mobile_number: string,
    password: string,
    timezone: Date,
    user_role: number,
    country: number,
    temp_pass: boolean
    //center: number,
  }