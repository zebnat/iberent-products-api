import { AppDataSource } from './data-source'
import { User as UserTypeorm } from './typeorm-entities/User'
import * as express from 'express'
import { UserRepositoryTypeormAdapter } from './libs/user/infrastructure/user.repository.typeorm-adapter'
import { UserCreatorUseCase } from './libs/user/application/user.creator.use-case'
import { UserAuthenticatorUseCase } from './libs/user/application/user.authenticator.use-case'
import { authenticateToken } from './libs/utils/jwt-middleware'

const API_ADMIN_USERNAME = 'admin'
const API_ADMIN_PASSWORD = 'admin' // hardcoded for simplicity (registered through useCase with an encrypted password using bcrypt)

const PORT = 3000
const app = express()
app.use(express.json())

// Services
const userTypeormEngine = new UserRepositoryTypeormAdapter(
  AppDataSource.getRepository(UserTypeorm),
)

const userCreator = new UserCreatorUseCase(userTypeormEngine) // Creates admin user (required for authentication and tokens)
const authenticator = new UserAuthenticatorUseCase(userTypeormEngine)

AppDataSource.initialize()
  .then(async () => {
    // orm data is ready

    await userCreator.execute({
      name: API_ADMIN_USERNAME,
      password: API_ADMIN_PASSWORD,
    })

    // authenticated hello world, requires access token like the rest of HTTP routes
    app.get('/hello', authenticateToken, function (req, res) {
      res.send('Hello world')
    })

    // this simple post request gets you a token! 
    app.post('/auth', async (req, res) => {
      const { name, password } = req.body
      const response = await authenticator.execute({
        name: name,
        password: password,
      })
      res.send(response)
    })

    app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}`)
    })
  })
  .catch((error) => console.log(error))
