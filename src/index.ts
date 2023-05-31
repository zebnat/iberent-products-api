import { AppDataSource } from './data-source'
import * as express from 'express'
import { productRouter } from './libs/product/presentation/product.router'
import { userRouter } from './libs/user/presentation/user.router'
import { UserService } from './libs/user/user.service'
import { UserRepositoryTypeormAdapter } from './libs/user/infrastructure/user.repository.typeorm-adapter'
import { User as UserTypeorm } from './typeorm-entities/User'

const API_ADMIN_USERNAME = 'admin'
const API_ADMIN_PASSWORD = 'admin' // hardcoded for simplicity (registered through useCase with an encrypted password using bcrypt)

const PORT = 3000
const app = express()
app.use(express.json())

AppDataSource.initialize()
  .then(async () => {
    // orm data is ready
    const userService = UserService.initialize(
      new UserRepositoryTypeormAdapter(
        AppDataSource.getRepository(UserTypeorm),
      ),
    )
    
    await userService.createAdminUser(API_ADMIN_USERNAME, API_ADMIN_PASSWORD)

    app.use([productRouter, userRouter]) // all product routes

    app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}`)
    })
  })
  .catch((error) => console.log(error))
