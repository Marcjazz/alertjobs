import { Controller, Get, Render } from '@nestjs/common';
import { EmployerService } from 'src/services/employer.service';

@Controller('employers')
export class EmployerCOntroller {
  constructor(private employerService: EmployerService) {}

  @Get()
  @Render('employers')
  async renderEmployers() {
    const employers = await this.employerService.findAll();
    return {
      employers: employers.map((employer) => employer.toJSON()),
    };
  }
}
