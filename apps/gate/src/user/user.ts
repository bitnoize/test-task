export type UserRole = 'user' | 'admin'

export interface User {
  userId: number
  username: string
  password: string
  role: UserRole
}
