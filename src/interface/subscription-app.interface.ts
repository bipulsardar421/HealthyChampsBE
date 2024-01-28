export type SubscriptionAppInterface = {
    subscription_app_id: number;
    parent_id: number;
    user_name: string;
    periodicity: string;
    from_date: Date;
    to_date: Date;
    cost: number;
  };
    
  export interface RequestSubscriptionAppInterface{
    parent_id: number;
    user_name: string;
    periodicity: string;
    from_date: Date;
    to_date: Date;
    cost: number;
  };
    