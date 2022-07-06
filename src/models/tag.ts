import * as Sequelize from 'sequelize';
import { DataTypes } from 'sequelize';
import {
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { JobHasTag } from './job-has-tag';

export interface TagAttributes {
  tag_id: string;
  tag_name: string;
}

export type TagPk = 'tag_id';
export type TagId = Tag[TagPk];
export type TagCreationAttributes = TagAttributes;

@Table({ tableName: 'tag' })
export class Tag
  extends Model<TagAttributes, TagCreationAttributes>
  implements TagAttributes
{
  @PrimaryKey
  @Column
  tag_id!: string;

  @Column
  tag_name!: string;

  @HasMany(() => JobHasTag)
  jobHasTags: JobHasTag[];

  static initModel(sequelize: Sequelize.Sequelize): typeof Tag {
    return Tag.init(
      {
        tag_id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        tag_name: {
          type: DataTypes.STRING(45),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'tag',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'tag_id' }],
          },
        ],
      },
    );
  }
}
