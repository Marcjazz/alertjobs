import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { randomUUID } from 'crypto';
import { User, UserCreationAttributes } from './models/user';

@Injectable()
export class AppService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async login(username: string) {
    return this.userModel.findOne({
      where: { username },
    });
  }

  async createLogin(user: UserCreationAttributes) {
    return this.userModel.create({
      user_id: randomUUID(),
      user_type: 'MANAGER',
      ...user,
    });
  }

  async deleteLogin(user_id: string) {
    return this.userModel.destroy({
      where: { user_id },
    });
  }
}
