import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Render,
  Res,
  Session,
  UseFilters,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AreaService } from './services/area.service';
import { CountryService } from './services/country.service';
import { EmployerService } from './services/employer.service';
import { JobService } from './services/job.service';
import { LocastionService } from './services/location.service';
import { TagService } from './services/tag.service';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UserCreationAttributes } from './models/user';
import { Sequelize } from 'sequelize-typescript';
import { ErrorFilter } from './errors/error.filter';
import { randomUUID } from 'crypto';

@Controller()
@UseFilters(ErrorFilter)
export class AppController {
  constructor(
    private readonly appService: AppService,
    private locationService: LocastionService,
    private countryService: CountryService,
    private tagService: TagService,
    private employerService: EmployerService,
    private jobService: JobService,
    private areaService: AreaService,
    private sequelize: Sequelize,
  ) {
    this.sequelize.sync().then(async () => {
      const country_id = randomUUID();
      const tags = await this.tagService.findAll();
      const country = await this.countryService.findAll();
      const locations = await this.locationService.findAll();
      const transaction = await sequelize.transaction();
      try {
        if (country.length === 0) {
          await this.countryService.create(
            {
              country_id,
              country_name: 'CAMEROON',
            },
            transaction,
          );
        }
        if (locations.length === 0) {
          await this.locationService.createMany(
            [
              {
                country_id,
                town: 'YAOUNDE',
                location_id: randomUUID(),
              },
              {
                country_id,
                town: 'DOUALA',
                location_id: randomUUID(),
              },
              {
                country_id,
                town: 'BUEA',
                location_id: randomUUID(),
              },
            ],
            transaction,
          );
        }
        if (tags.length === 0) {
          await this.tagService.createMany(
            [
              {
                tag_id: randomUUID(),
                tag_name: 'CDD',
              },
              {
                tag_id: randomUUID(),
                tag_name: 'CDI',
              },
              {
                tag_id: randomUUID(),
                tag_name: 'CDT',
              },
            ],
            transaction,
          );
        }
        await transaction.commit();
        console.log(`Sequelize sync successfully`);
      } catch (error) {
        await transaction.rollback();
        console.log(error?.message);
      }
    });
  }

  @Get('login')
  @Render('login')
  async renderLogin() {
    return {
      isLogin: true,
    };
  }

  @Get()
  @Render('index')
  async root() {
    const tags = await this.tagService.findAll();
    const countryData = await this.countryService.findAll();
    const locations = await this.locationService.findAll();

    const countries = countryData.map(({ country_id, country_name }) => {
      return {
        country_name,
        locations: locations
          .filter(({ country_id: id }) => id === country_id)
          .map((location) => location.toJSON()),
      };
    });

    return {
      countries,
      tags: tags.map((tag) => tag.toJSON()),
    };
  }

  @Get('admin')
  @Render('admin')
  async adminRoot(
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {
    if (!session.user)
      throw new HttpException(
        `You are not allow to access this routes`,
        HttpStatus.NON_AUTHORITATIVE_INFORMATION,
      );
    const jobs = await this.jobService.findAll();
    const locations = await this.locationService.findAll();

    const countries = (await this.countryService.findAll()).map(
      ({ country_id, country_name }) => ({
        country_id,
        country_name,
        locations: locations
          .filter(({ country_id: id }) => id === country_id)
          .map((location) => location.toJSON()),
      }),
    );

    const employers = (await this.employerService.findAll()).map((employer) =>
      employer.toJSON(),
    );

    const tags = (await this.tagService.findAll()).map((tag) => tag.toJSON());

    const areas = (await this.areaService.findAll()).map((area) =>
      area.toJSON(),
    );

    return {
      jobs: jobs.map((job) => ({
        ...job.toJSON(),
        employer_name: employers.find(
          ({ employer_id }) => employer_id === job.employer_id,
        )?.employer_name,
        job_maximal_age: job.job_maximal_age ?? null,
        job_minimal_age: job.job_minimal_age ?? null,

        //form-select data for hbs
        tags,
        areas,
        countries,
        employers,
      })),
      tags,
      areas,
      countries,
      employers,
      locations: locations.map((location) => ({
        ...location.toJSON(),
        country_name: countries.find(
          ({ country_id }) => country_id === location.country_id,
        )?.country_name,
      })),
    };
  }

  @Post('login')
  @Render('login')
  async loginUser(
    @Res() res: Response,
    @Session() session: Record<string, any>,
    @Body() login: { username: string; password: string },
  ) {
    const user = await this.appService.login(login.username);
    if (user && bcrypt.compareSync(login.password, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userSession } = user.toJSON();
      session.user = userSession;
      return res.redirect('/admin');
    }
    return {
      isLogin: true,
      errorMessage: `🤬🤬🤬 Incorrect email or password 🤬🤬🤬`,
    };
  }

  @Post('new-login')
  async newLogin(
    @Body('user') newUser: UserCreationAttributes,
    @Body('credential') credential: { username: string; password: string },
  ) {
    if (!newUser.password || !newUser.username)
      throw new HttpException(
        'Password and email are required',
        HttpStatus.BAD_REQUEST,
      );
    const admin = await this.appService.login(credential.username);
    if (
      admin &&
      bcrypt.compareSync(credential.password, admin.password) &&
      admin.user_type === 'OWNER'
    ) {
      return this.appService.createLogin({
        ...newUser,
        password: bcrypt.hashSync(newUser.password, 10),
      });
    }
  }
}
