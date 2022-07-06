import * as Sequelize from 'sequelize';
import { DataTypes, Optional } from 'sequelize';
import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Employer } from './employer';
import { JobHasArea } from './job-has-area';
import { JobHasLocation } from './job-has-location';
import { JobHasTag } from './job-has-tag';

export interface JobAttributes {
  job_id: string;
  job_title: string;
  job_salary?: number;
  job_requirements: string;
  job_minimal_age?: number;
  job_maximal_age?: number;
  job_todos: string;
  job_apply_address: string;
  employer_id: string;
  posted_at: Date;
  job_flyer?: string;
}

export type JobPk = 'job_id';
export type JobId = Job[JobPk];
export type JobOptionalAttributes = 'posted_at';
export type JobCreationAttributes = Optional<
  JobAttributes,
  JobOptionalAttributes
>;

@Table({ tableName: 'job' })
export class Job
  extends Model<JobAttributes, JobCreationAttributes>
  implements JobAttributes
{
  @PrimaryKey
  @Column
  job_id!: string;

  @Column
  job_title!: string;

  @Column
  job_salary?: number;

  @Column
  job_requirements!: string;

  @Column
  job_minimal_age?: number;

  @Column
  job_maximal_age?: number;

  @Column
  job_todos!: string;

  @Column
  job_apply_address!: string;

  @Column
  @ForeignKey(() => Employer)
  employer_id!: string;

  @Column
  posted_at!: Date;

  @Column
  job_flyer?: string;

  @HasMany(() => JobHasTag)
  jobHasTags: JobHasTag[];

  @HasMany(() => JobHasLocation)
  jobHasLocations: JobHasLocation[];

  @HasMany(() => JobHasArea)
  jobHasAreas: JobHasArea[];

  static initModel(sequelize: Sequelize.Sequelize): typeof Job {
    return Job.init(
      {
        job_id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        job_title: {
          type: DataTypes.STRING(45),
          allowNull: false,
        },
        job_salary: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        job_requirements: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        job_minimal_age: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        job_maximal_age: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        job_todos: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        job_apply_address: {
          type: DataTypes.STRING(45),
          allowNull: false,
        },
        employer_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        job_flyer: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        posted_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      },
      {
        sequelize,
        tableName: 'job',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'job_id' }],
          },
          {
            name: 'fk_offer_employer',
            using: 'BTREE',
            fields: [{ name: 'employer_id' }],
          },
        ],
      },
    );
  }
}
