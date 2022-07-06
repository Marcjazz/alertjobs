import * as Sequelize from 'sequelize';
import { DataTypes } from 'sequelize';
import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Country } from './country';
import { JobHasLocation } from './job-has-location';

export interface LocationAttributes {
  location_id: string;
  town: string;
  country_id: string;
}

export type LocationPk = 'location_id';
export type LocationId = Location[LocationPk];
export type LocationCreationAttributes = LocationAttributes;

@Table({ tableName: 'location' })
export class Location
  extends Model<LocationAttributes, LocationCreationAttributes>
  implements LocationAttributes
{
  @PrimaryKey
  @Column
  location_id!: string;

  @Column
  town!: string;

  @Column
  @ForeignKey(() => Country)
  country_id!: string;

  @HasMany(() => JobHasLocation)
  jobHasLocations: JobHasLocation[];

  static initModel(sequelize: Sequelize.Sequelize): typeof Location {
    return Location.init(
      {
        location_id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        town: {
          type: DataTypes.STRING(45),
          allowNull: false,
        },
        country_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'location',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'location_id' }],
          },
          {
            name: 'country_id',
            using: 'BTREE',
            fields: [{ name: 'country_id' }],
          },
        ],
      },
    );
  }
}
