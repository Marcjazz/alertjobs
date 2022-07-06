import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize/types';
import { JobHasTag, JobHasTagCreationAttributes } from 'src/models/job-has-tag';

export class JobHasTagService {
  constructor(
    @InjectModel(JobHasTag) private jobHasTagModel: typeof JobHasTag,
  ) {}

  async findJobs(tag_id: string) {
    return this.jobHasTagModel.findAll({
      where: { tag_id },
    });
  }

  async findTags(job_id: string) {
    return this.jobHasTagModel.findAll({
      where: { job_id },
    });
  }

  async bulkCreate(
    bulkData: Array<JobHasTagCreationAttributes>,
    transaction?: Transaction,
  ) {
    return this.jobHasTagModel.bulkCreate(bulkData, {
      transaction,
    });
  }
}
