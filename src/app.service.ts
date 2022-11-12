import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { randomUUID } from 'crypto';
import { Transaction } from 'sequelize/types';
import { User, UserCreationAttributes } from './models/user';

@Injectable()
export class AppService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async findUser(username: string) {
    return this.userModel.findOne({
      where: { username },
    });
  }

  async addUser(user: UserCreationAttributes, transaction?: Transaction) {
    return this.userModel.create(
      {
        user_id: randomUUID(),
        ...user,
      },
      { transaction },
    );
  }

  async deleteUser(user_id: string) {
    return this.userModel.destroy({
      where: { user_id },
    });
  }
}
