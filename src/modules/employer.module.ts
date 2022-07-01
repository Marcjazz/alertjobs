import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { EmployerCOntroller } from 'src/controllers/employer.controller';
import { Employer } from 'src/models/employer';
import { EmployerService } from 'src/services/employer.service';

@Module({
  imports: [SequelizeModule.forFeature([Employer])],
  providers: [EmployerService],
  controllers: [EmployerCOntroller],
})
export class EmployerModule {}
