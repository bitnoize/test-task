import { Module } from '@nestjs/common'
import { AuthModule } from './auth/index'
import { UserModule } from './user/index'
import { SocketModule } from './socket/index'

@Module({
  imports: [AuthModule, UserModule, SocketModule],
})
export class GateModule {}
