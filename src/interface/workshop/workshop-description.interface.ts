export interface WorkshopDescriptionInterface { 
    workshop_info_id: number;
    workshop_des_id:number;
    workshop_des: string;

  };
  export interface WorkDesInterface{
    workshop_des: string;
  };
  export interface RequestWorkshopDesInterface{
    workshop_info_id: number;
    workshop_des_id:number;
    workshopdes:WorkDesInterface;
  }