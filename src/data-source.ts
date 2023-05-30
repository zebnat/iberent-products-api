import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from './typeorm-entities/User'
import { Product } from './typeorm-entities/Product'

const { MYSQL_USER, MYSQL_DATABASE, MYSQL_PASSWORD } = process.env

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'mysql',
  port: 3306,
  username: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  synchronize: true,
  logging: false,
  entities: [User, Product],
  migrations: [],
  subscribers: [],
})
