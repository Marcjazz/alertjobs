import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Tag } from 'src/models/tag';

@Injectable()
export class TagService {
  constructor(@InjectModel(Tag) private tagModel: typeof Tag) {}

  async findAll() {
    return this.tagModel.findAll();
  }

  async findOne(tag_id: string) {
    return this.tagModel.findByPk(tag_id);
  }
}
