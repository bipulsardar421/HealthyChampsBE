import { Op } from "sequelize";
import {
  AllowNull,
  AutoIncrement,
  Column,
  Default,
  Model,
  NotEmpty,
  PrimaryKey,
  Sequelize,
  Table,
} from "sequelize-typescript";
import { decrypted, encrypted, sequelize } from "../helper";
import { BlogcategoryInterface } from "../interface";

@Table({

  tableName: 'blogcategory',
  timestamps: true
})
export class BlogcategoryDBModel extends Model implements BlogcategoryInterface {

  @PrimaryKey
  @AllowNull(true)
  @AutoIncrement
  @Column
  blog_category_id: number;

  @AllowNull(true)
  @Column(
    {
      unique: true,
      validate: {
        isUnique: function (value, next) {
          BlogcategoryDBModel.findOne({
            where: {
              $and: Sequelize.where(
                Sequelize.fn('lower', Sequelize.col('blog_category')),
                Sequelize.fn('lower', value)
              ),
              status: 'active',
              blog_category_id: { [Op.ne]: this.getDataValue('blog_category_id') }

            }
          })
            .then((data) => {
              if (data !== null) {
                return next('Blog Category is already present.')

              } else {
                return next();
              }
            }).catch(error => next())
        }
      }
    }
  )
  blog_category: string;

  @AllowNull(true)
  @Default('active')
  @Column
  status: string;


}
