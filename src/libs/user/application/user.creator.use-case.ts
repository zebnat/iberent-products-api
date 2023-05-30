import { User, UserRepository } from '../domain'
import * as bcrypt from 'bcryptjs'

export interface UserCreatorUseCaseRequest {
  name: string
  password: string
}

export interface UserCreatorUseCaseResponse {
  id: number
  name: string
  password: string
}

export class UserCreatorUseCase {
  constructor(private userRepository: UserRepository) {}

  public async execute(
    request: UserCreatorUseCaseRequest,
  ): Promise<UserCreatorUseCaseResponse> {
    try {
      const hashedPassword = await this.hashPassword(request.password)
      const newUser: User = { name: request.name, password: hashedPassword }
      const createdUser = await this.userRepository.save(newUser)

      const response: UserCreatorUseCaseResponse = {
        id: createdUser.id,
        name: createdUser.name,
        password: createdUser.password,
      }
      return response
    } catch (err) {
      // Duplicated key for user admin will be triggered
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10
    return new Promise((resolve, reject) => {
      bcrypt.genSalt(saltRounds, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash: string) => {
          if (err) {
            reject(err)
          } else {
            resolve(hash)
          }
        })
      })
    })
  }
}

// Create admin user (required for authentication and tokens)
/** 
const userRepo: UserRepository = new UserRepositoryTypeormAdapter(
  AppDataSource.getRepository(UserTypeorm),
)*/
