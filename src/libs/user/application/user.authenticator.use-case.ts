import { UserRepository } from '../domain'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'

export interface UserAuthenticatorUseCaseRequest {
  name: string
  password: string
}

export interface UserAuthenticatorUseCaseResponse {
  token: string
}

export class UserAuthenticatorUseCase {
  constructor(private userRepository: UserRepository) {}

  public async execute(
    request: UserAuthenticatorUseCaseRequest,
  ): Promise<UserAuthenticatorUseCaseResponse> {
    const user = await this.userRepository.getByName(request.name)

    await this.validatePassword(request.password, user.password)

    const token = this.generateJWT({ id: user.id })
    const response: UserAuthenticatorUseCaseResponse = {
      token: token,
    }

    return response
  }

  private async validatePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, hash, (err, result) => {
        if (err) reject(err)

        if (!result) reject(new Error('invalid password'))

        resolve(true)
      })
    })
  }

  private generateJWT(data: any) {
    const token: string = jwt.sign(data, process.env.JWT_SECRET)
    return token
  }
}
