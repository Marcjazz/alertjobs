import * as Sequelize from 'sequelize';
import { DataTypes, Optional } from 'sequelize';
import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Area } from './area';
import { Job } from './job';

export interface JobHasAreaAttributes {
  job_id: string;
  area_id: string;
}

export type JobHasAreaPk = 'job_id' | 'area_id';
export type JobHasAreaId = JobHasArea[JobHasAreaPk];
export type JobHasAreaCreationAttributes = JobHasAreaAttributes;

@Table({ tableName: 'job_has_area' })
export class JobHasArea
  extends Model<JobHasAreaAttributes, JobHasAreaCreationAttributes>
  implements JobHasAreaAttributes
{
  @PrimaryKey
  @Column
  @ForeignKey(() => Job)
  job_id!: string;

  @PrimaryKey
  @Column
  @ForeignKey(() => Area)
  area_id!: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof JobHasArea {
    return JobHasArea.init(
      {
        job_id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },
        area_id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },
      },
      {
        sequelize,
        tableName: 'job_has_area',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'job_id' }, { name: 'area_id' }],
          },
          {
            name: 'fk_job_has_area_area1',
            using: 'BTREE',
            fields: [{ name: 'area_id' }],
          },
        ],
      },
    );
  }
}
