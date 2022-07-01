import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SubscriberController } from 'src/controllers/subscriber.controller';
import { Subscriber } from 'src/models/subscriber';
import { SubscriberService } from 'src/services/subscriber.service';

@Module({
  imports: [SequelizeModule.forFeature([Subscriber])],
  providers: [SubscriberService],
  controllers: [SubscriberController],
})
export class SubscriberModule {}
