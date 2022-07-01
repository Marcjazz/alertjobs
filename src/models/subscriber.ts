import * as Sequelize from 'sequelize';
import { DataTypes } from 'sequelize';
import {
  Column,
  HasMany,
  PrimaryKey,
  Table,
  Model,
} from 'sequelize-typescript';
import { Feedback } from './feedback';

export interface SubscriberAttributes {
  subscriber_id: string;
  subscriber_email: string;
}

export type SubscriberPk = 'subscriber_id';
export type SubscriberId = Subscriber[SubscriberPk];
export type SubscriberCreationAttributes = SubscriberAttributes;

@Table({ tableName: 'subscriber' })
export class Subscriber
  extends Model<SubscriberAttributes, SubscriberCreationAttributes>
  implements SubscriberAttributes
{
  @PrimaryKey
  @Column
  subscriber_id!: string;

  @Column
  subscriber_email!: string;

  @HasMany(() => Feedback)
  feedbacks: Feedback[];

  static initModel(sequelize: Sequelize.Sequelize): typeof Subscriber {
    return Subscriber.init(
      {
        subscriber_id: {
          type: DataTypes.STRING(36),
          allowNull: false,
          primaryKey: true,
        },
        subscriber_email: {
          type: DataTypes.STRING(70),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'subscriber',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'subscriber_id' }],
          },
        ],
      },
    );
  }
}
