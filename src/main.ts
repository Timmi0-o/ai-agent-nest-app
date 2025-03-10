import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function aiAgentStart() {
  const PORT = process.env.APPLICATION_PORT ?? 10000;
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
}
aiAgentStart();
