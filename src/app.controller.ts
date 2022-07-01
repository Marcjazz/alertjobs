import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { AreaService } from './services/area.service';
import { CountryService } from './services/country.service';
import { EmployerService } from './services/employer.service';
import { JobService } from './services/job.service';
import { LocastionService } from './services/location.service';
import { TagService } from './services/tag.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private locationService: LocastionService,
    private countryService: CountryService,
    private tagService: TagService,
    private employerService: EmployerService,
    private jobService: JobService,
    private areaService: AreaService,
  ) {}

  @Get()
  @Render('index')
  async root() {
    const countries = await this.countryService.findAll();
    const locations = await this.locationService.findAll();
    const tags = await this.tagService.findAll();
    return {
      tags: tags.map((tag) => tag.toJSON()),
      countries: countries.map(({ country_id, country_name }) => {
        return {
          country_name,
          locations: locations
            .filter(({ country_id: id }) => id === country_id)
            .map((location) => location.toJSON()),
        };
      }),
    };
  }

  @Get('admin')
  @Render('admin')
  async adminRoot() {
    const countries = await this.countryService.findAll();
    const employers = await this.employerService.findAll();
    const locations = await this.locationService.findAll();
    const jobs = await this.jobService.findAll();
    const tags = await this.tagService.findAll();
    const areas = await this.areaService.findAll();
    return {
      jobs: jobs.map((job) => {
        return {
          ...job.toJSON(),
          employer_name: employers.find(
            ({ employer_id }) => employer_id === job.employer_id,
          ).employer_name,
        };
      }),
      employers: employers.map((employer) => employer.toJSON()),
      tags: tags.map((tag) => tag.toJSON()),
      areas: areas.map((area) => area.toJSON()),
      locations: locations.map((location) => {
        return {
          ...location.toJSON(),
          country_name: countries.find(
            ({ country_id }) => country_id === location.country_id,
          ).country_name,
        };
      }),
    };
  }
}
