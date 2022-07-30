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
import { randomUUID } from 'crypto';

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
    private sequelize: Sequelize,
  ) {
    this.sequelize.sync({ force: true }).then(() => {
      //   this.newLogin({
      //     user_id: randomUUID(),
      //     password: 'alertjobs',
      //     username: 'admin@alertjobs.online',
      //   });
    });
  }

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
      ({ country_id, country_name }) => {
        return {
          country_id,
          country_name,
          locations: locations
            .filter(({ country_id: id }) => id === country_id)
            .map((location) => location.toJSON()),
        };
      },
    );

    const employers = (await this.employerService.findAll()).map((employer) =>
      employer.toJSON(),
    );

    const tags = (await this.tagService.findAll()).map((tag) => tag.toJSON());

    const areas = (await this.areaService.findAll()).map((area) =>
      area.toJSON(),
    );

    return {
      jobs: jobs.map((job) => {
        return {
          ...job.toJSON(),
          employer_name: employers.find(
            ({ employer_id }) => employer_id === job.employer_id,
          )?.employer_name,

          //form-select data for hbs
          tags,
          areas,
          countries,
          employers,
        };
      }),
      tags,
      areas,
      countries,
      employers,
      locations: locations.map((location) => {
        return {
          ...location.toJSON(),
          country_name: countries.find(
            ({ country_id }) => country_id === location.country_id,
          )?.country_name,
        };
      }),
    };
  }

  @Post('login')
  async loginUser(
    @Res() res: Response,
    @Session() session: Record<string, any>,
    @Body() login: { username: string; password: string },
  ) {
    const user = await this.appService.login(login.username);
    if (user && bcrypt.compareSync(login.password, user.password)) {
      const { password, ...userSession } = user.toJSON();
      session.user = userSession;
      return res.redirect('/admin');
    }
    res.redirect('/');
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
