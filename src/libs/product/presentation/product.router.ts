import * as express from 'express'
import { authenticateToken } from '../../utils/jwt-middleware'
import { ProductController } from './product.controller'
import { ProductService } from '../application/product.service'

const productRouter = express.Router()

const productController = new ProductController(new ProductService())

const handleErrorStatus = (err: Error) => {
  let statusCode = 500

  if (err.message.match(/invalid parameters/i)) {
    statusCode = 400
  }

  return statusCode
}

productRouter.post(
  '/products',
  authenticateToken,
  async (request, response) => {
    try {
      const product = await productController.postProduct(request.body)
      return response.status(200).send({ message: 'sucess', data: product })
    } catch (err) {
      let statusCode = handleErrorStatus(err)
      return response.status(statusCode).send({ message: err.message })
    }
  },
)

productRouter.put(
  '/products/:id',
  authenticateToken,
  async (request, response) => {
    try {
      const { id } = request.params
      request.body.id = id
      const product = await productController.updateProduct(request.body)
      return response.status(200).send({ message: 'success', data: product })
    } catch (err) {
      let statusCode = handleErrorStatus(err)
      return response.status(statusCode).send({ message: err.message })
    }
  },
)

productRouter.delete(
  '/products/:id',
  authenticateToken,
  async (request, response) => {
    try {
      const { id } = request.params
      await productController.deleteProduct(parseInt(id))
      return response.status(200).send({ message: 'success' })
    } catch (err) {
      let statusCode = handleErrorStatus(err)
      return response.status(statusCode).send({ message: err.message })
    }
  },
)

productRouter.get(
  '/products/:id',
  authenticateToken,
  async (request, response) => {
    try {
      const { id } = request.params
      const product = await productController.getProductById(parseInt(id))
      return response.status(200).send({ message: 'sucess', data: product })
    } catch (err) {
      let statusCode = handleErrorStatus(err)
      return response.status(statusCode).send({ message: err.message })
    }
  },
)

productRouter.get('/products', authenticateToken, async (request, response) => {
  try {
    const products = await productController.getProducts()
    return response.status(200).send({ message: 'sucess', data: products })
  } catch (err) {
    let statusCode = handleErrorStatus(err)
    return response.status(statusCode).send({ message: err.message })
  }
})

export { productRouter }
