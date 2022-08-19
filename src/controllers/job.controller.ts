import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  Render,
  Res,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Sequelize } from 'sequelize-typescript';
import { ErrorFilter } from 'src/errors/error.filter';
import { Area } from 'src/models/area';
import { Employer } from 'src/models/employer';
import { Job, JobCreationAttributes } from 'src/models/job';
import { AreaService } from 'src/services/area.service';
import { EmployerService } from 'src/services/employer.service';
import { JobHasAreaService } from 'src/services/job-has-area.service';
import { JobHasLocationService } from 'src/services/job-has-location.service';
import { JobHasTagService } from 'src/services/job-has-tag.service';
import { JobService } from 'src/services/job.service';
import { LocastionService } from 'src/services/location.service';
import { TagService } from 'src/services/tag.service';

interface JobQuery {
  area_id?: string;
  tag_id?: string;
  location_id?: string;
}
class JobDependecies implements JobCreationAttributes {
  job_id: string;
  job_title: string;
  job_salary?: number;
  job_requirements: string;
  job_minimal_age?: number;
  job_maximal_age?: number;
  job_todos: string;
  job_apply_address: string;
  employer_id: string;
  job_flyer?: string;
  posted_at?: Date;
  tags?: string | string[];
  areas?: string | string[];
  locations?: string | string[];
}

@Controller('jobs')
@UseFilters(ErrorFilter)
export class JobController {
  constructor(
    private sequelize: Sequelize,
    private jobService: JobService,
    private tagService: TagService,
    private areaService: AreaService,
    private employerService: EmployerService,
    private locationService: LocastionService,
    private jobHasTagService: JobHasTagService,
    private jobHasAreaService: JobHasAreaService,
    private jobHasLocationService: JobHasLocationService,
  ) {}

  @Get()
  async findAll(@Query() query: JobQuery) {
    const jobs = await this.jobService.findAll();

    const completeJobs: Array<any> = [];
    for (let i = 0; i < jobs.length; i++) {
      const { job_id, employer_id } = jobs[i];
      const employer = await this.employerService.findOne(employer_id);
      const { jobAreas, jobLocations, jobTags } = await this.getJobRelatedData(
        job_id,
        query,
      );
      if (jobAreas.length > 0)
        completeJobs.push({
          jobTags,
          jobAreas,
          jobLocations,
          ...jobs[i].toJSON(),
          employer: employer.toJSON(),
        });
    }
    return { jobs: completeJobs };
  }

  @Get(':job_id')
  @Render('job')
  async getJobDetail(@Param('job_id') job_id: string) {
    const job = await this.jobService.findOne(job_id);
    if (!job)
      throw new HttpException(
        'This Page has no content',
        HttpStatus.NO_CONTENT,
      );
    let { jobHasAreas } = job;
    const employer_id = job.employer_id;
    const employer = await this.employerService.findOne(employer_id);
    const areas = await this.areaService.findAll();
    jobHasAreas = await this.jobHasAreaService.findAreas(job_id);

    const jobAreas = jobHasAreas.map((jobHasArea) => {
      return {
        ...jobHasArea.toJSON(),
        ...areas.find(({ area_id }) => area_id === jobHasArea.area_id).toJSON(),
      };
    });

    const jobs = await this.jobService.findAll();

    //jobs from the same area
    let sameAreaJobs: Array<any> = [];
    if (jobHasAreas.length > 0) {
      sameAreaJobs = await this.buildSameAreaJobs(
        jobs,
        areas,
        jobHasAreas[0].area_id,
      );
    }

    //jobs from the same employer
    const sameEmployerJobs: Array<any> = await this.buildSameEmployerJobs(
      jobs,
      areas,
      employer,
    );

    return {
      job: {
        jobAreas,
        ...job.toJSON(),
        employer: employer.toJSON(),
        sameEmployerJobs: sameEmployerJobs.filter(
          ({ job_id: id }) => id !== job_id,
        ),
        ...(await this.getJobRelatedData(job_id, {})),
        sameAreaJobs: sameAreaJobs.filter(({ job_id: id }) => id !== job_id),
      },
    };
  }

  @Post('new')
  async addNewJob(@Res() res: Response, @Body() newJob: JobDependecies) {
    const { tags, locations, areas } = newJob;
    try {
      return this.sequelize.transaction(async (transaction) => {
        const { job_id } = await this.jobService.create(newJob, transaction);
        if (areas) {
          if (typeof areas === 'string')
            await this.jobHasAreaService.bulkCreate(
              [{ area_id: areas, job_id }],
              transaction,
            );
          else
            await this.jobHasAreaService.bulkCreate(
              areas?.map((area_id) => ({ area_id, job_id })),
              transaction,
            );
        }

        if (tags) {
          if (typeof tags === 'string')
            await this.jobHasTagService.bulkCreate(
              [{ tag_id: tags, job_id }],
              transaction,
            );
          else
            await this.jobHasTagService.bulkCreate(
              tags?.map((tag_id) => ({ tag_id, job_id })),
              transaction,
            );
        }

        if (locations) {
          if (typeof locations === 'string')
            await this.jobHasLocationService.bulkCreate(
              [{ location_id: locations, job_id }],
              transaction,
            );
          else
            await this.jobHasLocationService.bulkCreate(
              locations?.map((location_id) => ({ location_id, job_id })),
              transaction,
            );
        }
        return res.redirect('/admin');
      });
    } catch (error) {
      throw new HttpException(
        `Could not create employer: ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':job_id/edit-image')
  @UseInterceptors(FileInterceptor('job_flyer'))
  async updateLogo(
    @Res() res: Response,
    @Param('job_id') job_id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!job_id)
      throw new HttpException(
        'job_id is required',
        HttpStatus.PRECONDITION_FAILED,
      );
    try {
      await this.jobService.update(job_id, { job_flyer: file.filename });
      return res.redirect('/admin');
    } catch (error) {
      throw new HttpException(
        `Could not create employer: ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':job_id/edit')
  async updateJob(
    @Res() res: Response,
    @Param('job_id') job_id: string,
    @Body() job: Partial<JobCreationAttributes>,
  ) {
    if (!job_id)
      throw new HttpException(
        'job_id is required',
        HttpStatus.PRECONDITION_FAILED,
      );
    try {
      await this.jobService.update(job_id, job);
      return res.redirect('/admin');
    } catch (error) {
      throw new HttpException(
        `Could not create employer: ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':job_id/delete')
  async deleteEmployer(@Res() res: Response, @Param('job_id') job_id: string) {
    if (!job_id)
      throw new HttpException(
        'job_id is required',
        HttpStatus.PRECONDITION_FAILED,
      );
    try {
      await this.jobService.delete(job_id);
      return res.redirect('/admin');
    } catch (error) {
      throw new HttpException(
        `Could not create employer: ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async buildSameAreaJobs(jobs: Job[], areas: Area[], area_id: string) {
    const areaHasJobs = await this.jobHasAreaService.findJobs(area_id);
    const employers = await this.employerService.findAll();
    return jobs
      .map((job) => {
        return {
          ...job.toJSON(),
          employer: employers
            .find(({ employer_id }) => employer_id === job.employer_id)
            .toJSON(),
          jobAreas: areaHasJobs.map((areaHasJob) => {
            return {
              ...areaHasJob.toJSON(),
              ...areas
                .find(({ area_id }) => area_id === areaHasJob.area_id)
                .toJSON(),
            };
          }),
        };
      })
      .filter(({ job_id }) =>
        areaHasJobs.map(({ job_id }) => job_id).includes(job_id),
      );
  }

  private async buildSameEmployerJobs(
    jobs: Job[],
    areas: Area[],
    employer: Employer,
  ) {
    const employerJobs = jobs.filter(
      ({ employer_id }) => employer_id === employer.employer_id,
    );
    const sameEmployerJobs: Array<any> = [];
    for (let i = 0; i < employerJobs.length; i++) {
      const job = employerJobs[i];
      const jobHasAreas = await this.jobHasAreaService.findAreas(job.job_id);
      sameEmployerJobs.push({
        employer,
        ...job.toJSON(),
        jobAreas: jobHasAreas.map((jobHasArea) => {
          return {
            ...jobHasArea.toJSON(),
            ...areas
              .find(({ area_id }) => area_id === jobHasArea.area_id)
              .toJSON(),
          };
        }),
      });
    }
    return sameEmployerJobs;
  }

  private async getJobRelatedData(job_id: string, query: JobQuery) {
    //job has tags
    const tags = await this.tagService.findAll();
    const jobHasTags = await this.jobHasTagService.findTags(job_id);
    let jobTags = jobHasTags.map((jobHasTag) => ({
      ...jobHasTag.toJSON(),
      ...tags.find(({ tag_id }) => tag_id === jobHasTag.tag_id).toJSON(),
    }));

    //job has locations
    const locations = await this.locationService.findAll();
    const jobHasLocations = await this.jobHasLocationService.findLocations(
      job_id,
    );
    let jobLocations = jobHasLocations.map((jobHasTag) => ({
      ...jobHasTag.toJSON(),
      ...locations
        .find(({ location_id }) => location_id === jobHasTag.location_id)
        ?.toJSON(),
    }));

    //job has areas
    const areas = await this.areaService.findAll();
    const jobHasAreas = await this.jobHasAreaService.findAreas(job_id);
    let jobAreas = jobHasAreas.map((jobHasArea) => ({
      ...jobHasArea.toJSON(),
      ...areas.find(({ area_id }) => area_id === jobHasArea.area_id)?.toJSON(),
    }));

    const { area_id, tag_id, location_id } = query;

    if (tag_id && tag_id !== 'undefined')
      jobTags = jobTags.filter(({ tag_id: id }) => id === tag_id);

    if (location_id && location_id !== 'undefined')
      jobLocations = jobLocations.filter(
        ({ location_id: id }) => id === location_id,
      );

    if (area_id && area_id !== 'undefined')
      jobAreas = jobAreas.filter(({ area_id: id }) => id === area_id);
    return { jobAreas, jobTags, jobLocations };
  }
}
