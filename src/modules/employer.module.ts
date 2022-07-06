import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { SequelizeModule } from '@nestjs/sequelize';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { EmployerController } from 'src/controllers/employer.controller';
import { Employer } from 'src/models/employer';
import { EmployerService } from 'src/services/employer.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Employer]),
    MulterModule.register({
      dest: './public/images',
      storage: diskStorage({
        destination: (req, file, cb) => {
          console.log(file);
          cb(null, './public/images');
        },
        filename: (req, file, cb) => {
          console.log(file);
          cb(
            null,
            `${file.fieldname}_${randomUUID()}.${file.mimetype.split('/')[1]}`,
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        const extIndex = file.originalname.lastIndexOf('.');
        let ext = file.originalname.substring(extIndex).toLowerCase();
        console.log(file);
        if (!['.jpg', '.jpeg', '.png', '.jfif'].includes(ext)) {
          throw new HttpException(
            'File type is not supported',
            HttpStatus.NOT_ACCEPTABLE,
          );
        }
        cb(null, true);
      },
    })
  ],
  providers: [EmployerService],
  controllers: [EmployerController],
})
export class EmployerModule {}
