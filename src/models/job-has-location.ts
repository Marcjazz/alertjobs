import * as Sequelize from 'sequelize';
import { DataTypes } from 'sequelize';
import {
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Job } from './job';
import { Location } from './location';

export interface JobHasLocationAttributes {
  job_id: string;
  location_id: string;
}

export type JobHasLocationPk = 'job_id' | 'location_id';
export type JobHasLocationId = JobHasLocation[JobHasLocationPk];
export type JobHasLocationCreationAttributes = JobHasLocationAttributes;

@Table({ tableName: 'job_has_location' })
export class JobHasLocation
  extends Model<JobHasLocationAttributes, JobHasLocationCreationAttributes>
  implements JobHasLocationAttributes
{
  @PrimaryKey
  @Column
  @ForeignKey(() => Job)
  job_id!: string;

  @PrimaryKey
  @Column
  @ForeignKey(() => Location)
  location_id!: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof JobHasLocation {
    return JobHasLocation.init(
      {
        job_id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },
        location_id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },
      },
      {
        sequelize,
        tableName: 'job_has_location',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'job_id' }, { name: 'location_id' }],
          },
          {
            name: 'fk_job_has_location_location1',
            using: 'BTREE',
            fields: [{ name: 'location_id' }],
          },
        ],
      },
    );
  }
}
