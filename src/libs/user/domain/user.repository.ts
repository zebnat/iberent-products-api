import { User } from './user.entity'

export interface UserRepository {
  save(user: User): Promise<User>
  getByName(name: string): Promise<User>
}
