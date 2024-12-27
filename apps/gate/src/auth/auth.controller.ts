import { Response } from 'express'
import { Body, Controller, Res, Post, Header, HttpCode, HttpStatus } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignInDto } from './dto/signin.dto'
import { User } from '../user/user'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @Header('content-type', 'application/json')
  async signin(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<User> {
    const { username, password } = signInDto

    const { user, access_token } = await this.authService.signIn(username, password)

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
    })

    return user
  }
}
