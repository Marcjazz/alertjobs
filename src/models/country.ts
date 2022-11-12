import * as Sequelize from 'sequelize';
import { DataTypes } from 'sequelize';
import {
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Location } from './location';

export interface CountryAttributes {
  country_id: string;
  country_name: string;
}

export type CountryCreationAttributes = CountryAttributes;

@Table({ tableName: 'country' })
export class Country
  extends Model<CountryAttributes, CountryCreationAttributes>
  implements CountryAttributes
{
  @PrimaryKey
  @Column
  country_id!: string;

  @Column
  country_name!: string;

  @HasMany(() => Location)
  locations: Location[];

  static initModel(sequelize: Sequelize.Sequelize): typeof Country {
    return Country.init(
      {
        country_id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
        },
        country_name: {
          type: DataTypes.STRING(70),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'country',
        timestamps: false,
      },
    );
  }
}
