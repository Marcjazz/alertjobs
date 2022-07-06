import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { LocationController } from 'src/controllers/location.controller';
import { Location } from 'src/models/location';
import { LocastionService } from 'src/services/location.service';

@Module({
  imports: [SequelizeModule.forFeature([Location])],
  controllers: [LocationController],
  providers: [LocastionService],
})
export class LocationModule {}
