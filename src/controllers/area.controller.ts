import { Controller, Get } from '@nestjs/common';
import { AreaService } from 'src/services/area.service';

@Controller('areas')
export class AreaController {
  constructor(private areaService: AreaService) {}

  @Get()
  async findAll() {
    return { areas: await this.areaService.findAll() };
  }
}
