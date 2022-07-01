import * as Sequelize from 'sequelize';
import { DataTypes } from 'sequelize';
import {
  Column,
  ForeignKey,
  PrimaryKey,
  Table,
  Model,
} from 'sequelize-typescript';
import { Subscriber } from './subscriber';

export interface FeedbackAttributes {
  feedback_id: string;
  feedback_message: string;
  subscriber_id: string;
}

export type FeedbackPk = 'feedback_id';
export type FeedbackId = Feedback[FeedbackPk];
export type FeedbackCreationAttributes = FeedbackAttributes;

@Table({ tableName: 'feedback' })
export class Feedback
  extends Model<FeedbackAttributes, FeedbackCreationAttributes>
  implements FeedbackAttributes
{
  @PrimaryKey
  @Column
  feedback_id!: string;

  @Column
  feedback_message!: string;

  @ForeignKey(() => Subscriber)
  @Column
  subscriber_id!: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof Feedback {
    return Feedback.init(
      {
        feedback_id: {
          type: DataTypes.STRING(36),
          allowNull: false,
          primaryKey: true,
        },
        feedback_message: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        subscriber_id: {
          type: DataTypes.STRING(36),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'feedback',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'feedback_id' }],
          },
        ],
      },
    );
  }
}
