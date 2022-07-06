import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { randomUUID } from 'crypto';
import { Transaction } from 'sequelize/types';
import { Job, JobCreationAttributes } from 'src/models/job';

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

  async create(newJob: JobCreationAttributes, transaction?: Transaction) {
    return this.jobModel.create(
      {
        job_id: randomUUID(),
        ...newJob,
      },
      { transaction },
    );
  }

  async update(job_id: string, job: Partial<JobCreationAttributes>) {
    await this.jobModel.update(job, {
      where: { job_id },
    });
  }

  async delete(job_id: string) {
    return await this.jobModel.destroy({
      where: { job_id },
    });
  }
}
