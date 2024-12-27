import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { SocketGateway } from './socket.gateway'
import { SocketController } from './socket.controller'
import { AuthModule } from '../auth/index'

@Module({
  imports: [
    AuthModule,
    ClientsModule.register([
      {
        name: 'TEST_DATA',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://sheila.warp:5672'],
          queue: 'test',
          queueOptions: {
            //durable: false
          },
        },
      },
    ]),
  ],
  providers: [SocketGateway],
  controllers: [SocketController],
})
export class SocketModule {}
