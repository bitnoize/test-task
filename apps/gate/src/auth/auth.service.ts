//import * as bcrypt from 'bcrypt'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthPayload } from './auth'
import { User, UserService } from '../user/index'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string): Promise<{ user: User; access_token: string }> {
    const user = await this.userService.findOne(username)

    if (!user) {
      throw new UnauthorizedException()
    }

    if (user.password !== password) {
      throw new UnauthorizedException()
    }

    const access_token = await this.jwtService.signAsync({
      sub: user.userId,
      // ...
    })

    return {
      user,
      access_token,
    }
  }

  async verify(accessToken: string): Promise<AuthPayload | undefined> {
    try {
      return await this.jwtService.verifyAsync<AuthPayload>(accessToken)
    } catch (error) {
      return undefined
    }
  }
}
