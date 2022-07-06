import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { randomUUID } from 'crypto';
import { Location, LocationCreationAttributes } from 'src/models/location';

@Injectable()
export class LocastionService {
  constructor(@InjectModel(Location) private locationModel: typeof Location) {}

  async findAll() {
    return this.locationModel.findAll();
  }

  async findOne(location_id: string) {
    return this.locationModel.findByPk(location_id);
  }

  async create(newLocation: LocationCreationAttributes) {
    return this.locationModel.create({
      ...newLocation,
      location_id: randomUUID(),
    });
  }

  async delete(location_id: string) {
    return this.locationModel.destroy({ where: { location_id } });
  }
}
