import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { randomUUID } from 'crypto';
import { Transaction } from 'sequelize/types';
import { Tag, TagCreationAttributes } from 'src/models/tag';

@Injectable()
export class TagService {
  constructor(@InjectModel(Tag) private tagModel: typeof Tag) {}

  async findAll() {
    return this.tagModel.findAll();
  }

  async findOne(tag_id: string) {
    return this.tagModel.findByPk(tag_id);
  }

  async create(newTag: TagCreationAttributes) {
    return this.tagModel.create({ ...newTag, tag_id: randomUUID() });
  }
  async createMany(
    newTags: TagCreationAttributes[],
    transaction?: Transaction,
  ) {
    return this.tagModel.bulkCreate(newTags, { transaction });
  }

  async delete(tag_id: string) {
    return this.tagModel.destroy({
      where: { tag_id },
    });
  }
}
