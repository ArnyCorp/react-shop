import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      "http://localhost:5000",
      "http://localhost:5001",
      "http://localhost:5002",
      "http://localhost:6006",
    ],
  });
  await app.listen(process.env.PORT ? Number(process.env.PORT) : 3001);
}

bootstrap();
