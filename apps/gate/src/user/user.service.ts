import { Injectable } from '@nestjs/common'
import { User } from './user'

@Injectable()
export class UserService {
  private readonly users: User[] = [
    {
      userId: 1,
      username: 'user',
      password: 'blablabla',
      role: 'user',
    },
    {
      userId: 2,
      username: 'admin',
      password: 'super$secret',
      role: 'admin',
    },
  ]

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username)
  }
}
