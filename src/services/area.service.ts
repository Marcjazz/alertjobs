import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Area } from 'src/models/area';

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
}
