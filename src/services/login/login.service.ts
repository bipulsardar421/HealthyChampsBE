import { EncriptPasswordHelper } from "../../helper";
import { AllergenDBModel, ChildAllergenDBModel, ChildDietaryDBModel, ChildInfoDBModel, ChildPreferenceDBModel, CountryDBModel, DietaryDBModel, NutritionCategoryDBModel, ParentInfoDBModel, UserRolesDBModel, UserRolesFuncDBModel, UserSignUpDBModel } from "../../db-models";
import { LoginInterface } from "../../interface";

export class LoginService extends EncriptPasswordHelper {

    constructor() {
        super()
    }

    public async validLogin(request: LoginInterface): Promise<any> {
        return await UserSignUpDBModel.findOne({
            attributes: ['first_name', 'last_name', 'user_signup_id', 'email_address', 'mobile_number', 'temp_pass', 'role_id', 'country'],
            where: {
                email_address: request.username,
                status: 'active'
            },
            include: [{
                model: UserRolesDBModel,
                required: false,
                include: [{
                    model: UserRolesFuncDBModel,
                    required: false
                }]
            }],
        })
    }

    public async getpassword(request: LoginInterface): Promise<any> {
        return await UserSignUpDBModel.findOne({
            attributes: ['password', 'email_address'],
            where: {
                email_address: request,
                status: 'active'
            }
        })
    }

    public async mobileLoginValidation(request: LoginInterface): Promise<any> {
        return await ParentInfoDBModel.findOne({
            attributes: ['parent_id', 'first_name', 'last_name', 'email_address', 'mobile_number', 'login_orgin', 'temp_pass'],
            where: {
                email_address: request.username,
                status: 'active'
            },
            include: [{
                model: ChildInfoDBModel,
                include: [
                    {
                        model: ChildDietaryDBModel,
                        include: [{
                            model: DietaryDBModel
                        }]
                    },
                    {
                        model: ChildAllergenDBModel,
                        include: [{
                            model: AllergenDBModel
                        }]
                    },
                    {
                        model: ChildPreferenceDBModel,
                        include: [{
                            model: NutritionCategoryDBModel
                        }]
                    }
                ]
            },
            {
                model: CountryDBModel,
            }
        ]
        })
    }

    public async mobileLoginPassValidation(request: LoginInterface): Promise<any> {
        return await ParentInfoDBModel.findOne({
            attributes: ['password', 'email_address'],
            where: {
                email_address: request,
                status: 'active'
            },
        });
    }
}