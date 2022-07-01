import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JobHasLocation } from 'src/models/job-has-location';

@Injectable()
export class JobHasLocationService {
  constructor(
    @InjectModel(JobHasLocation) private jobHasLocation: typeof JobHasLocation,
  ) {}

  async findLocations(job_id: string) {
    return this.jobHasLocation.findAll({
      where: { job_id },
    });
  }

  async findJobs(location_id: string) {
    return this.jobHasLocation.findAll({
      where: { location_id },
    });
  }
}
