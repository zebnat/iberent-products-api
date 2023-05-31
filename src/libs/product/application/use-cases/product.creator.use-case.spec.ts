import { ProductRepository, Product } from '../../domain'
import {
  ProductCreatorUseCase,
  ProductCreatorUseCaseRequest,
  ProductCreatorUseCaseResponse,
} from './product.creator.use-case'
import { createProductDTO } from '../create.product.dto'

describe('ProductCreatorUseCase', () => {
  let productRepositoryMock: ProductRepository
  let productCreatorUseCase: ProductCreatorUseCase

  beforeEach(() => {
    jest.resetAllMocks()

    // Set up any necessary dependencies or mocks
    productRepositoryMock = {
      save: jest.fn(),
      getAll: null,
      getById: null,
      deleteById: null,
    }
    productCreatorUseCase = new ProductCreatorUseCase(productRepositoryMock)
  })

  describe('execute', () => {
    it('should create a product and return the product details', async () => {
      const request: ProductCreatorUseCaseRequest = {
        name: 'Test Product',
        description: 'Test description',
        price: 999,
        stock: 10,
      }

      const createdProduct: Product = {
        id: 123,
        ...request,
      }

      // Mock the productRepository.save method
      ;(productRepositoryMock.save as jest.Mock).mockResolvedValue(
        createdProduct,
      )

      const expectedResponse: ProductCreatorUseCaseResponse = {
        id: createdProduct.id,
        name: createdProduct.name,
        description: createdProduct.description,
        price: createdProduct.price,
        stock: createdProduct.stock,
      }

      const result = await productCreatorUseCase.execute(request)

      expect(productRepositoryMock.save).toHaveBeenCalledWith(request)
      expect(result).toEqual(expectedResponse)
    })
  })
})
