import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create NestJS application instance
  const app = await NestFactory.create(AppModule);
  // Start listening on configured port (default: 3000)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
