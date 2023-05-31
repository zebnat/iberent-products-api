import * as express from 'express'
import { authenticateToken } from '../../utils/jwt-middleware'
import { UserService } from '../user.service'
import { UserRepositoryTypeormAdapter } from '../infrastructure/user.repository.typeorm-adapter'
import { AppDataSource } from '../../../data-source'
import { User as UserTypeorm } from '../../../typeorm-entities/User'

const userRouter = express.Router()

const userService = UserService.initialize(
  new UserRepositoryTypeormAdapter(AppDataSource.getRepository(UserTypeorm)),
)

/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * ** * * * * * * * *
 * I haven't created a controller for user stuff, this is simple enough
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

// authenticated hello world, requires access token like the rest of HTTP routes
userRouter.get('/hello', authenticateToken, function (req, res) {
  res.send('Hello world')
})

// this simple post request gets you a token!
userRouter.post('/auth', async (req, res) => {
  const { name, password } = req.body
  try {
    const response = await userService.authenticate(name, password)
    res.status(200).send({ message: 'success', data: response })
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
})

export { userRouter }
