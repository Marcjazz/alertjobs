import { InjectModel } from '@nestjs/sequelize';
import { JobHasTag } from 'src/models/job-has-tag';

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
}
