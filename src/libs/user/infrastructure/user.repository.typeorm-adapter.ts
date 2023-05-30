import { UserRepository } from '../domain'
import { User } from '../domain/user.entity'
import { User as UserTypeormEntity } from '../../../typeorm-entities/User'
import { Repository } from 'typeorm'

export class UserRepositoryTypeormAdapter implements UserRepository {
  constructor(private orm: Repository<UserTypeormEntity>) {}

  getByName(name: string): Promise<User> {
    return new Promise(async (resolve, reject) => {
      try {
        const userTypeorm = await this.orm.findOneByOrFail({
          username: name,
        })

        resolve({
          id: userTypeorm.id,
          name: userTypeorm.username,
          password: userTypeorm.password,
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  save(user: User): Promise<User> {
    return new Promise(async (resolve, reject) => {
      const userTypeorm = this.orm.create()
      userTypeorm.username = user.name
      userTypeorm.password = user.password

      try {
        const savedEntity = await this.orm.save(userTypeorm)
        if (!savedEntity) {
          throw Error('Unable to save entity UserTypeormEntity')
        } else {
          resolve(user)
        }
      } catch (err) {
        reject(err)
      }
    })
  }
}
