import { ProductRepository, Product } from '../../domain'
import {
  ProductUpdaterUseCase,
  ProductUpdaterUseCaseRequest,
  ProductUpdaterUseCaseResponse,
} from './product.updater.use-case'
import { updateProductDTO } from '../update.product.dto'

describe('ProductUpdaterUseCase', () => {
  let productRepositoryMock: ProductRepository
  let productUpdaterUseCase: ProductUpdaterUseCase

  beforeEach(() => {
    jest.clearAllMocks()

    // Set up any necessary dependencies or mocks
    productRepositoryMock = {
      save: jest.fn(),
      getById: jest.fn(),
      getAll: null,
      deleteById: null,
    }
    productUpdaterUseCase = new ProductUpdaterUseCase(productRepositoryMock)
  })

  describe('execute', () => {
    it('should update a product and return the updated product details', async () => {
      const request: ProductUpdaterUseCaseRequest = {
        id: 123,
        name: 'Updated Product',
        description: 'Updated Description',
        price: 1999,
        stock: 5,
      }

      const product: Product = {
        id: request.id,
        name: request.name,
        description: request.description,
        price: request.price,
        stock: request.stock,
      }

      const updatedProduct: Product = {
        id: request.id,
        name: request.name,
        description: request.description,
        price: request.price,
        stock: request.stock,
      }

      // Mock the productRepository.save method
      ;(productRepositoryMock.save as jest.Mock).mockResolvedValue(
        updatedProduct,
      )

      const expectedResponse: ProductUpdaterUseCaseResponse = {
        id: updatedProduct.id,
        description: updatedProduct.description,
        name: updatedProduct.name,
        price: updatedProduct.price,
        stock: updatedProduct.stock,
      }

      const result = await productUpdaterUseCase.execute(request)

      expect(productRepositoryMock.save).toHaveBeenCalledWith(product)
      expect(result).toEqual(expectedResponse)
    })
  })
})
