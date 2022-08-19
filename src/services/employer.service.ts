import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { randomUUID } from 'crypto';
import { Employer, EmployerCreationAttributes } from 'src/models/employer';

@Injectable()
export class EmployerService {
  constructor(@InjectModel(Employer) private employerModel: typeof Employer) {}

  async findAll() {
    return this.employerModel.findAll();
  }

  async findOne(employer_id: string) {
    return this.employerModel.findByPk(employer_id);
  }

  async create(newEmployer: EmployerCreationAttributes) {
    return this.employerModel.create({
      ...newEmployer,
      employer_id: randomUUID(),
    });
  }

  async update(
    employer_id: string,
    employer: Partial<EmployerCreationAttributes>,
  ) {
    await this.employerModel.update(employer, {
      where: { employer_id },
    });
  }
}
