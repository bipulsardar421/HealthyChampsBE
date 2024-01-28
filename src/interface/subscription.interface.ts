
export interface SubscriptionInterface {
    subscription_id: number,
    periodicity: string,
    cost: number
}

export type RequestSubscriptionInterface = {
    periodicity: string,
    cost: number
  };

