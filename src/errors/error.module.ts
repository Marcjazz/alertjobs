import { Module } from '@nestjs/common';
import { ErrorService } from './error.filter';

@Module({
  providers: [ErrorService],
  exports: [ErrorService],
})
export class ErrorModule {}
