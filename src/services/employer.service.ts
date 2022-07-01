import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Employer } from 'src/models/employer';

@Injectable()
export class EmployerService {
  constructor(@InjectModel(Employer) private employerModel: typeof Employer) {}

  async findAll() {
    return this.employerModel.findAll();
  }

  async findOne(employer_id: string) {
    return this.employerModel.findByPk(employer_id);
  }
}
