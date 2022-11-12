import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException, NotFoundException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.render('errors/500', {
      errorMessage: exception.getResponse(),
    });
  }
}
