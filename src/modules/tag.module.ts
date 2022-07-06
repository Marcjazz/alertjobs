import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TagController } from 'src/controllers/tag,controller';
import { Tag } from 'src/models/tag';
import { TagService } from 'src/services/tag.service';

@Module({
  imports: [SequelizeModule.forFeature([Tag])],
  providers: [TagService],
  controllers: [TagController],
})
export class TagModule {}
