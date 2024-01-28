import { ChildAllergenInterface } from "./child-allergen.interface";
import { ChildDietaryInterface } from "./child-dietary.interface";
import { ChildPreferenceInterface } from "./child-preference.interface";

export type ChildInfoInterface = {
    child_info_id: number;
    parent_id: number;
    date_of_birth: string;
    child_name: string;
    allergen?: ChildAllergenInterface[];
    dietary?: ChildDietaryInterface[];
    nutrition_category?: ChildPreferenceInterface[];
}

export interface RequestChildInfoInterface {
    date_of_birth: string;
    child_name: string;
    dietary: number[];
    allergen: number[];
    nutrition_category: number[];
}