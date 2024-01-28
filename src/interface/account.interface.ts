export type AccountInterface = {
    account_id: number,
    organisation_name: string,
    organisation_address: string,
    billing_account_name: string,
    billing_account_number: number,
    billing_account_status: string,
    billing_address: string,
    billing_first_name: string,
    billing_last_name: string,
    billing_phone_number: string,
    billing_email_address: string;
    sales_first_name: string;
    sales_last_name: string;
    sales_phone_number: string;
    sales_email_address: string;
  };

  export type RequestAccountInterface = {
    organisation_name: string,
    organisation_address: string,
    billing_account_name: string,
    billing_account_number: number,
    billing_account_status: string,
    billing_address: string,
    billing_first_name: string,
    billing_last_name: string,
    billing_phone_number: string,
    billing_email_address: string;
    sales_first_name: string;
    sales_last_name: string;
    sales_phone_number: string;
    sales_email_address: string;
  };