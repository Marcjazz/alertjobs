import * as Sequelize from 'sequelize';
import { DataTypes, Optional } from 'sequelize';
import {
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { JobHasArea } from './job-has-area';

export interface AreaAttributes {
  area_id: string;
  area_name: string;
}

export type AreaPk = 'area_id';
export type AreaId = Area[AreaPk];
export type AreaCreationAttributes = AreaAttributes;

@Table({ tableName: 'area' })
export class Area
  extends Model<AreaAttributes, AreaCreationAttributes>
  implements AreaAttributes
{
  @PrimaryKey
  @Column
  area_id!: string;
  @Column
  area_name!: string;

  @HasMany(() => JobHasArea)
  jobHasAreas: JobHasArea[];

  static initModel(sequelize: Sequelize.Sequelize): typeof Area {
    return Area.init(
      {
        area_id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        area_name: {
          type: DataTypes.STRING(45),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'area',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'area_id' }],
          },
        ],
      },
    );
  }
}
