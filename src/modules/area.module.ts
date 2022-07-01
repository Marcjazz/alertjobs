import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AreaController } from 'src/controllers/area.controller';
import { Area } from 'src/models/area';
import { AreaService } from 'src/services/area.service';

@Module({
  imports: [SequelizeModule.forFeature([Area])],
  providers: [AreaService],
  controllers: [AreaController],
})
export class AreaModule {}
