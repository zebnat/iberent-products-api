import { User } from './user.entity'

export interface UserRepository {
  save(user: User): Promise<User>
  getByNameAndPassword(name: string, password: string): Promise<User> | null
}
