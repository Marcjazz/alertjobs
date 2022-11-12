import * as Sequelize from 'sequelize';
import { DataTypes, Optional } from 'sequelize';
import { Column, PrimaryKey, Model, Table } from 'sequelize-typescript';

export interface UserAttributes {
  user_id: string;
  username: string;
  user_type: 'MANAGER' | 'OWNER';
  password: string;
}

export type UserPk = 'user_id';
export type UserId = User[UserPk];
export type UserOptionalAttributes = 'user_type';
export type UserCreationAttributes = Optional<
  UserAttributes,
  UserOptionalAttributes
>;

@Table({ tableName: 'user' })
export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  @PrimaryKey
  @Column
  user_id!: string;

  @Column
  username!: string;

  @Column
  user_type!: 'MANAGER' | 'OWNER';

  @Column
  password!: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof User {
    return User.init(
      {
        user_id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        username: {
          type: DataTypes.STRING(70),
          allowNull: false,
          unique: true,
        },
        user_type: {
          type: DataTypes.ENUM('MANAGER', 'OWNER'),
          allowNull: false,
          defaultValue: 'MANAGER',
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'user',
        timestamps: false,
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'user_id' }],
          },
        ],
      },
    );
  }
}
