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
import { Tag } from './tag';

export interface JobHasTagAttributes {
  job_id: string;
  tag_id: string;
}

export type JobHasTagPk = 'job_id' | 'tag_id';
export type JobHasTagId = JobHasTag[JobHasTagPk];
export type JobHasTagCreationAttributes = JobHasTagAttributes;

@Table({ tableName: 'job_has_tag' })
export class JobHasTag
  extends Model<JobHasTagAttributes, JobHasTagCreationAttributes>
  implements JobHasTagAttributes
{
  @PrimaryKey
  @Column
  @ForeignKey(() => Job)
  job_id!: string;

  @PrimaryKey
  @Column
  @ForeignKey(() => Tag)
  tag_id!: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof JobHasTag {
    return JobHasTag.init(
      {
        job_id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },
        tag_id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },
      },
      {
        sequelize,
        tableName: 'job_has_tag',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'job_id' }, { name: 'tag_id' }],
          },
          {
            name: 'fk_job_has_tag_tag1',
            using: 'BTREE',
            fields: [{ name: 'tag_id' }],
          },
        ],
      },
    );
  }
}
