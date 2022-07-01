import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  Subscriber,
  SubscriberCreationAttributes,
} from 'src/models/subscriber';

@Injectable()
export class SubscriberService {
  constructor(
    @InjectModel(Subscriber) private subscriberModel: typeof Subscriber,
  ) {}

  async create(subscriber: SubscriberCreationAttributes) {
    return this.subscriberModel.create(subscriber);
  }
}
