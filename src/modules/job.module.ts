import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JobController } from 'src/controllers/job.controller';
import { Area } from 'src/models/area';
import { Employer } from 'src/models/employer';
import { Job } from 'src/models/job';
import { JobHasArea } from 'src/models/job-has-area';
import { JobHasLocation } from 'src/models/job-has-location';
import { JobHasTag } from 'src/models/job-has-tag';
import { Location } from 'src/models/location';
import { Tag } from 'src/models/tag';
import { AreaService } from 'src/services/area.service';
import { EmployerService } from 'src/services/employer.service';
import { JobHasAreaService } from 'src/services/job-has-area.service';
import { JobHasLocationService } from 'src/services/job-has-location.service';
import { JobHasTagService } from 'src/services/job-has-tag.service';
import { JobService } from 'src/services/job.service';
import { LocastionService } from 'src/services/location.service';
import { TagService } from 'src/services/tag.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Job,
      Tag,
      Area,
      Location,
      Employer,
      JobHasTag,
      JobHasArea,
      JobHasLocation,
    ]),
  ],
  providers: [
    JobService,
    TagService,
    AreaService,
    EmployerService,
    LocastionService,
    JobHasTagService,
    JobHasAreaService,
    JobHasLocationService,
  ],
  controllers: [JobController],
})
export class JobModule {}
