import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { engine } from 'express-handlebars';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { Logger } from '@nestjs/common';
import MemoryStore = require('memorystore');

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets('./public');
  app.setBaseViewsDir('./src/views');
  app.setViewEngine('hbs');
  app.engine('.hbs', engine({ defaultLayout: 'main', extname: '.hbs' }));

  app.use(
    session({
      resave: false,
      secret: 'alert-jobs',
      saveUninitialized: false,
      name: 'AlertJobSession',
      store: new (MemoryStore(session))({
        checkPeriod: 12 * 60 * 60 * 1000,
      }),
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Alert Jobs')
    .setDescription('Alert Jobs API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const PORT = process.env.PORT || 8080;
  await app.listen(PORT);
  Logger.log(`Server is runnnig on port ${PORT}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
