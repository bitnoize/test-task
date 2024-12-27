import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
//import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { WsAdapter } from '@nestjs/platform-ws'
import { GateModule } from './gate.module'

process.on('unhandledRejection', (reason: string, p: Promise<unknown>) => {
  console.error(`Unhandled rejection`, { reason, p })
  process.exit(1)
})

process.on('uncaughtException', (error) => {
  console.error(`Uncaught exception`, { error })
  process.exit(1)
})

async function bootstrap() {
  const app = await NestFactory.create(GateModule)

  /*
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        process.env['RABBIT_URL'] || `amqp://localhost:5672`
      ],
      queue: 'test',
      queueOptions: {
        durable: false
      },
    }
  })
  */

  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.useWebSocketAdapter(new WsAdapter(app))

  //await app.startAllMicroservices()
  await app.listen(process.env.port ?? 3000)
}
bootstrap()
