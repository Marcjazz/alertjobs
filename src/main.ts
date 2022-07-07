import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { engine } from 'express-handlebars';
import { AppModule } from './app.module';
import * as session from 'express-session';
const MemoryStore = require('memorystore')(session);

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets('./public');
  app.setBaseViewsDir('./src/views');
  app.setViewEngine('hbs');
  app.engine('.hbs', engine({ defaultLayout: 'main', extname: '.hbs' }));

  app.use(
    session({
      secret: 'alert-jobs',
      resave: false,
      saveUninitialized: false,
      store: new MemoryStore({
        checkPeriod: 86400000,
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

  await app.listen(process.env.PORT || 8080);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
