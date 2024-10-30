import * as morgan from 'morgan';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(morgan('combined')); // Añadir morgan para logs detallados
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
