import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { randomUUID } from 'crypto';
import { Area, AreaCreationAttributes } from 'src/models/area';

@Injectable()
export class AreaService {
  constructor(
    @InjectModel(Area)
    private areaModel: typeof Area,
  ) {}

  async findAll(): Promise<Area[]> {
    return this.areaModel.findAll();
  }

  async findOne(area_id: string): Promise<Area> {
    return this.areaModel.findByPk(area_id);
  }

  async create(newArea: AreaCreationAttributes) {
    return this.areaModel.create({ ...newArea, area_id: randomUUID() });
  }

  async delete(area_id: string) {
    return this.areaModel.destroy({ where: { area_id } });
  }
}
