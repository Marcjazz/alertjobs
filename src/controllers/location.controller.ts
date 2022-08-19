import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { LocationCreationAttributes } from 'src/models/location';
import { LocastionService } from 'src/services/location.service';

@Controller('locations')
export class LocationController {
  constructor(private locationService: LocastionService) {}

  @Post('new')
  async addNewLocation(
    @Res() res: Response,
    @Body() newLocation: LocationCreationAttributes,
  ) {
    try {
      await this.locationService.create(newLocation);
      res.redirect('/admin');
    } catch (error) {
      throw new HttpException(
        `Could not create employer: ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':location_id/delete')
  async deleteLocation(
    @Res() res: Response,
    @Param('location_id') location_id: string,
  ) {
    await this.locationService.delete(location_id);
    res.redirect('/admin');
  }
}
