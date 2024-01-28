import { DateOnlyDataType } from "sequelize";
import { WorkshopCredentialsInterface } from "./workshop-credential.interface";

export type WorkshopInfoInterface = {
    workshop_info_id: number;
    title: string;
    start_date: Date;
    end_date: Date;
    start_time: number;
    end_time: number;
    duration: number;
    organiser: string;
    mode: string;
    session_type: string;
    session_cost: number;
    credentials?: WorkshopCredentialsInterface[];
  };

  export type RequestWorkshopInfoInterface = {
    title: string;
    start_date: Date;
    end_date: Date;
    start_time: number;
    end_time: number;
    duration: number;
    organiser: string;
    mode: string;
    session_type: string;
    session_cost: number;
    status: string;
  };
  
  
  
 
  