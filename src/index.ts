import { AppDataSource } from './data-source'
import { User } from './typeorm-entities/User'
import * as express from 'express'
import * as bodyParser from 'body-parser'

AppDataSource.initialize()
  .then(async () => {
    console.log('Insert api admin once')
    const user = new User()
    user.username = 'admin'
    user.password = 'admin' // should be salted and encrypted (bcrypt)

    try {
      await AppDataSource.manager.save(user)
      console.log('Saved a new user with id: ' + user.id)
    } catch (e) {}

    console.log('Loading users from the database!')
    const users = await AppDataSource.manager.find(User)
    console.log('Loaded users: ', users)

    const PORT = 3000
    const app = express()

    app.use(
      bodyParser.urlencoded({
        extended: true,
      }),
    )
    app.use(bodyParser.json())

    app.get('/', function (req, res) {
      res.send('Hello worl!')
    })

    app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}`)
    })
  })
  .catch((error) => console.log(error))
