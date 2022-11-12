import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Render,
  Res,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { ErrorFilter } from 'src/errors/error.filter';
import { EmployerCreationAttributes } from 'src/models/employer';
import { EmployerService } from 'src/services/employer.service';

@Controller('employers')
@UseFilters(ErrorFilter)
export class EmployerController {
  constructor(private employerService: EmployerService) {}

  @Get()
  @Render('employers')
  async renderEmployers() {
    const employers = await this.employerService.findAll();
    return {
      showJobFilter: true,
      employers: employers.map((employer) => employer.toJSON()),
    };
  }

  @Post('new')
  async addNewEmployer(
    @Res() res: Response,
    @Body() newEmployer: EmployerCreationAttributes,
  ) {
    // try {
    await this.employerService.create(newEmployer);
    return res.redirect('/admin');
    // } catch (error) {
    //   throw new HttpException(
    //     `Could not create employer: ${error?.message}`,
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }
  }

  @Post(':employer_id/edit-image')
  @UseInterceptors(FileInterceptor('logo_ref'))
  async updateLogo(
    @Res() res: Response,
    @Param('employer_id') employer_id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(file);
    if (!employer_id)
      throw new HttpException(
        'employer_id is required',
        HttpStatus.PRECONDITION_FAILED,
      );
    try {
      await this.employerService.update(employer_id, {
        logo_ref: file.filename,
      });
      return res.redirect('/admin');
    } catch (error) {
      throw new HttpException(
        `Could not create employer: ${error?.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post(':employer_id/edit')
  async updateEmployer(
    @Res() res: Response,
    @Param('employer_id') employer_id: string,
    @Body() employer: Partial<EmployerCreationAttributes>,
  ) {
    if (!employer_id)
      throw new HttpException(
        'employer_id is required',
        HttpStatus.PRECONDITION_FAILED,
      );
    try {
      await this.employerService.update(employer_id, employer);
      return res.redirect('/admin');
    } catch (error) {
      throw new HttpException(
        `Could not create employer: ${error?.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
