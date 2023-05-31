import { UserCreatorUseCase } from './application/user.creator.use-case'
import {
  UserAuthenticatorUseCase,
  UserAuthenticatorUseCaseResponse,
} from './application/user.authenticator.use-case'
import { UserRepository } from './domain'

export class UserService {
  private userCreator: UserCreatorUseCase
  private userAuthenticator: UserAuthenticatorUseCase

  private constructor(
    userCreator: UserCreatorUseCase,
    userAuthenticator: UserAuthenticatorUseCase,
  ) {
    this.userCreator = userCreator
    this.userAuthenticator = userAuthenticator
  }

  public async createAdminUser(username: string, password: string) {
    await this.userCreator.execute({
      name: username,
      password: password,
    })
  }

  public async authenticate(
    username: string,
    password: string,
  ): Promise<UserAuthenticatorUseCaseResponse> {
    const response = await this.userAuthenticator.execute({
      name: username,
      password: password,
    })

    return response
  }

  public static initialize(repository: UserRepository) {
    // Services
    const userCreator = new UserCreatorUseCase(repository) // Creates admin user (required for authentication and tokens)
    const authenticator = new UserAuthenticatorUseCase(repository)
    return new UserService(userCreator, authenticator)
  }
}
