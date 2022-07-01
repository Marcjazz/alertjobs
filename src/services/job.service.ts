import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Job } from 'src/models/job';

@Injectable()
export class JobService {
  constructor(
    @InjectModel(Job)
    private jobModel: typeof Job,
  ) {}

  async findAll(): Promise<Job[]> {
    return this.jobModel.findAll();
  }

  async findOne(job_id: string): Promise<Job> {
    return this.jobModel.findByPk(job_id);
  }
}
