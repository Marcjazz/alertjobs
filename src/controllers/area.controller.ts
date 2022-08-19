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
import { AreaCreationAttributes } from 'src/models/area';
import { AreaService } from 'src/services/area.service';

@Controller('areas')
export class AreaController {
  constructor(private areaService: AreaService) {}

  @Get()
  async findAll() {
    return { areas: await this.areaService.findAll() };
  }

  @Post('new')
  async addNewArea(
    @Res() res: Response,
    @Body() newArea: AreaCreationAttributes,
  ) {
    try {
      await this.areaService.create(newArea);
      return res.redirect('/admin');
    } catch (error) {
      throw new HttpException(
        `Could not create employer: ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':area_id/delete')
  async deleteArea(@Res() res: Response, @Param('area_id') area_id: string) {
    try {
      await this.areaService.delete(area_id);
      res.redirect('/admin');
    } catch (error) {
      throw new HttpException(
        `Could not create employer: ${error?.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
