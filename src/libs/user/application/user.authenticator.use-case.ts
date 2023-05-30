import { UserRepository } from '../domain'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'

export interface UserAuthenticatorUseCaseRequest {
  name: string
  password: string
}

export interface UserAuthenticatorUseCaseResponse {
  status: string
  token: string
}

export class UserAuthenticatorUseCase {
  constructor(private userRepository: UserRepository) {}

  public async execute(
    request: UserAuthenticatorUseCaseRequest,
  ): Promise<UserAuthenticatorUseCaseResponse> {
    try {
      const user = await this.userRepository.getByName(request.name)
      this.validatePassword(request.password, user.password)

      const token = this.generateJWT({ id: user.id })
      const response: UserAuthenticatorUseCaseResponse = {
        status: 'success',
        token: token,
      }

      return response
    } catch (err) {
      console.error('problem with authentication')
      console.error(err)
    }
  }

  private async validatePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash, (err, result) => {
        if (err) {
          reject(err)
        } else {
          if (result) {
            resolve(true)
          } else {
            reject('invalid password')
          }
        }
      })
    })
  }

  private generateJWT(data: any) {
    const token: string = jwt.sign(data, process.env.JWT_SECRET)
    return token
  }
}
