import { ChildAllergenInterface } from "./child-allergen.interface";
import { ChildDietaryInterface } from "./child-dietary.interface";
import { ChildPreferenceInterface } from "./child-preference.interface";

export type ChildEditInterface = {
    child_info_id: number;
    child_name: string;
    date_of_birth: string;
    parent_id: number;
    dietary?: ChildDietaryInterface[];
    allergen?: ChildAllergenInterface[];
    nutrition_category?: ChildPreferenceInterface[];
}