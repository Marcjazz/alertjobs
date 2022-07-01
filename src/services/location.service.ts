import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Location } from 'src/models/location';

@Injectable()
export class LocastionService {
  constructor(@InjectModel(Location) private locationModel: typeof Location) {}

  async findAll() {
    return this.locationModel.findAll();
  }

  async findOne(location_id: string) {
    return this.locationModel.findByPk(location_id);
  }
}
