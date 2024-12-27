import * as crypto from 'crypto'
import * as cookie from 'cookie'
import Client, { Server } from 'ws'
import { Request } from 'express'
import { Inject, Req } from '@nestjs/common'
import {
  MessageBody,
  SubscribeMessage,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { AuthService } from '../auth/index'

export type ClientExt = Client & { userId?: number; connectId?: string }

@WebSocketGateway({ clientTracking: true })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private authService: AuthService) {}

  @WebSocketServer() private server: Server

  private connectedClients = new Map<number, string[]>()

  async handleConnection(client: ClientExt, @Req() req: Request) {
    const parsedCookies = cookie.parse(req.headers['cookie'] ?? '')
    const accessToken = parsedCookies['access_token']
    if (accessToken === undefined) {
      client.close(4401, 'No access_token provided')

      return
    }

    const authPayload = await this.authService.verify(accessToken)
    if (authPayload === undefined) {
      client.close(4402, 'Authorization failed')

      return
    }

    const userId = authPayload.sub
    const connectId = crypto.randomUUID()

    const connectIds = this.connectedClients.get(userId)
    if (connectIds !== undefined) {
      connectIds.push(connectId)
    } else {
      this.connectedClients.set(userId, [connectId])
    }

    console.log(`Connect userId: ${userId} connectId: ${connectId}`)
    console.log('connectedClients', Object.fromEntries(this.connectedClients))

    client.userId = userId
    client.connectId = connectId
  }

  handleDisconnect(client: ClientExt) {
    const { userId, connectId } = client

    if (userId !== undefined && connectId !== undefined) {
      const connectIds = this.connectedClients.get(userId)
      if (connectIds !== undefined) {
        const filteredConnectIds = connectIds.filter((id) => id !== connectId)
        if (filteredConnectIds.length > 0) {
          this.connectedClients.set(userId, filteredConnectIds)
        } else {
          this.connectedClients.delete(userId)
        }
      } else {
        console.warn(`No connections for userId: ${userId} on diconnect`)
      }

      console.log(`Disconnect userId: ${userId} connectId: ${connectId}`)
      console.log('connectedClients', Object.fromEntries(this.connectedClients))
    }
  }

  @SubscribeMessage('events')
  async onEvents(@MessageBody() data: any, @ConnectedSocket() client: Client): Promise<string> {
    return 'asasas'
  }
}
