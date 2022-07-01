import * as Sequelize from 'sequelize';
import { DataTypes, Optional } from 'sequelize';
import {
  Column,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Job } from './job';

export interface EmployerAttributes {
  employer_id: string;
  employer_name: string;
  employer_telephone: number;
  employer_email: string;
  employer_website?: string;
  employer_linkedin?: string;
  precise_address: string;
  logo_ref?: string;
}

export type EmployerPk = 'employer_id';
export type EmployerId = Employer[EmployerPk];
export type EmployerOptionalAttributes =
  | 'employer_website'
  | 'employer_linkedin';
export type EmployerCreationAttributes = Optional<
  EmployerAttributes,
  EmployerOptionalAttributes
>;

@Table({ tableName: 'employer' })
export class Employer
  extends Model<EmployerAttributes, EmployerCreationAttributes>
  implements EmployerAttributes
{
  @PrimaryKey
  @Column
  employer_id!: string;

  @Column
  employer_name!: string;

  @Column
  employer_telephone!: number;

  @Column
  employer_email!: string;

  @Column
  employer_website?: string;

  @Column
  employer_linkedin?: string;

  @Column
  precise_address!: string;

  @Column
  logo_ref?: string;

  @HasMany(() => Job)
  jobs: Job[];

  static initModel(sequelize: Sequelize.Sequelize): typeof Employer {
    return Employer.init(
      {
        employer_id: {
          type: DataTypes.STRING(36),
          allowNull: false,
          primaryKey: true,
        },
        employer_name: {
          type: DataTypes.STRING(45),
          allowNull: false,
        },
        employer_telephone: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        employer_email: {
          type: DataTypes.STRING(45),
          allowNull: false,
        },
        employer_website: {
          type: DataTypes.STRING(45),
          allowNull: true,
        },
        employer_linkedin: {
          type: DataTypes.STRING(45),
          allowNull: true,
        },
        precise_address: {
          type: DataTypes.STRING(45),
          allowNull: false,
        },
        logo_ref: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'employer',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'employer_id' }],
          },
        ],
      },
    );
  }
}
