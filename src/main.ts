import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';

const connect = async () => {
  await mongoose
    .connect('mongodb://localhost:27017/testbd')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await connect();

  console.log(process.env.PORT);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
