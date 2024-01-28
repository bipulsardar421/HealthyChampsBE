export type IngredientInterface = {
  sno: number;
  supplier_name: number;
  category: number;
  name: string;
  quantity:string;
  measurement_id: number;
  unit_size: number;
  unit_price: number;
  priority: number;
  form_id: number;
  cost_per_unit: string;
  remark: string;
  conversion: number;
  food_category_id: number;
};


export interface RequestIngredientInterface {
  supplier_name: string;
  category: string;
  name: string;
  quantity:string;
  measurement_id: string;
  unit_size: number;
  unit_price: number;
  priority: number;
  form_id: string;
  cost_per_unit: string;
  conversion: number;
  food_category_id: string;
}
