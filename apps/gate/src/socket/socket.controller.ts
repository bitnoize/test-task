import { Inject, Controller } from '@nestjs/common'
import { ClientProxy, MessagePattern, EventPattern, Payload } from '@nestjs/microservices'

@Controller()
export class SocketController {
  constructor(@Inject('TEST_DATA') private testDataClient: ClientProxy) {}

  @MessagePattern('rate.updated')
  async handleRateUpdated(@Payload() data: any) {
    console.log(data)
  }
}
