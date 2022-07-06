import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
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
    await this.areaService.create(newArea);
    return res.redirect('/admin');
  }

  @Get(':area_id/delete')
  async deleteArea(@Res() res: Response, @Param('area_id') area_id: string) {
    await this.areaService.delete(area_id);
    res.redirect('/admin');
  }
}
