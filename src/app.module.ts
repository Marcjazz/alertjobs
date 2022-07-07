import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Area } from './models/area';
import { Country } from './models/country';
import { Employer } from './models/employer';
import { Feedback } from './models/feedback';
import { Job } from './models/job';
import { JobHasArea } from './models/job-has-area';
import { JobHasLocation } from './models/job-has-location';
import { JobHasTag } from './models/job-has-tag';
import { Location } from './models/location';
import { Subscriber } from './models/subscriber';
import { Tag } from './models/tag';
import { User } from './models/user';
import { AreaModule } from './modules/area.module';
import { EmployerModule } from './modules/employer.module';
import { JobModule } from './modules/job.module';
import { LocationModule } from './modules/location.module';
import { SubscriberModule } from './modules/subscriber.module';
import { TagModule } from './modules/tag.module';
import { AreaService } from './services/area.service';
import { CountryService } from './services/country.service';
import { EmployerService } from './services/employer.service';
import { JobService } from './services/job.service';
import { LocastionService } from './services/location.service';
import { TagService } from './services/tag.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.USER_NAME,
      password: process.env.PASSWORD,
      database: process.env.DB_NAME,
      define: {
        timestamps: false,
      },
      models: [
        Job,
        Tag,
        User,
        Area,
        Country,
        Location,
        Employer,
        Feedback,
        JobHasTag,
        JobHasArea,
        Subscriber,
        JobHasLocation,
      ],
    }),
    SequelizeModule.forFeature([User, Area, Job, Tag, Country, Location, Employer]),
    TagModule,
    JobModule,
    AreaModule,
    EmployerModule,
    LocationModule,
    SubscriberModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TagService,
    JobService,
    AreaService,
    CountryService,
    EmployerService,
    LocastionService,
  ],
})
export class AppModule {}
