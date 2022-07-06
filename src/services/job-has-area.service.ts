import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize/types';
import {
  JobHasArea,
  JobHasAreaCreationAttributes,
} from 'src/models/job-has-area';

@Injectable()
export class JobHasAreaService {
  constructor(
    @InjectModel(JobHasArea) private jobHasAreaModel: typeof JobHasArea,
  ) {}

  async findJobs(area_id: string) {
    return this.jobHasAreaModel.findAll({
      where: { area_id },
    });
  }

  async findAreas(job_id: string) {
    return this.jobHasAreaModel.findAll({
      where: { job_id },
    });
  }

  async bulkCreate(
    bulkData: Array<JobHasAreaCreationAttributes>,
    transaction?: Transaction,
  ) {
    return this.jobHasAreaModel.bulkCreate(bulkData, {
      transaction,
    });
  }
}
