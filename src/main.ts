import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { engine } from 'express-handlebars';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets('./public');
  app.setBaseViewsDir('./src/views');
  app.setViewEngine('hbs');
  app.engine('.hbs', engine({ defaultLayout: 'main', extname: '.hbs' }));

  const config = new DocumentBuilder()
    .setTitle('Alert Jobs')
    .setDescription('Alert Jobs API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
