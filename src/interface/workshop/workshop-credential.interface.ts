export type WorkshopCredentialsInterface = {
  workshop_credentials_id: number,
  workshop_info_id: number,
  meeting_link: string,
  meeting_id: string,
  passcode: string,
  location: string,
 
};

export interface WorkshopCredInterface {
  meeting_link: string,
  meeting_id: string,
  passcode: string,
  location: string,
}


export interface RequestWorkshopCredentialsInterface{
  workshop_credentials_id: number,
  workshop_info_id: number,
  cred: WorkshopCredInterface,
}

