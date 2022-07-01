import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Response } from 'express';
import { SubscriberService } from 'src/services/subscriber.service';

@Controller('subscribers')
export class SubscriberController {
  constructor(private subscriberService: SubscriberService) {}

  @Post('new')
  async newSubscription(@Res() res: Response, @Body('email') subscriber_email: string) {
    if (!subscriber_email)
      throw new HttpException('Incomplete Data supply', HttpStatus.BAD_REQUEST);
    await this.subscriberService.create({
      subscriber_id: randomUUID(),
      subscriber_email,
    });
    res.redirect('/')
  }
}
