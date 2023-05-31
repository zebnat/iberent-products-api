import { Product, ProductRepository } from '../../domain'
import { ProductFindoneUseCase } from './product.findone.use-case'
import { FindOneProductDTO } from '../findone.product.dto'

describe('ProductFindoneUseCase', () => {
  let productRepositoryMock: ProductRepository
  let productFindoneUseCase: ProductFindoneUseCase

  beforeEach(() => {
    jest.clearAllMocks()

    // Set up any necessary dependencies or mocks
    productRepositoryMock = {
      getById: jest.fn(),
      getAll: null,
      deleteById: null,
      save: null,
    }
    productFindoneUseCase = new ProductFindoneUseCase(productRepositoryMock)
  })

  describe('execute', () => {
    it('should fetch a product with the provided ID', async () => {
      const id: FindOneProductDTO = 123 // Example ID

      const mockProduct: Product = {
        id: id,
        name: 'Product',
        description: 'Description',
        price: 9.99,
        stock: 10,
      }

      // Mock the productRepository.getById method
      ;(productRepositoryMock.getById as jest.Mock).mockResolvedValue(
        mockProduct,
      )

      const result = await productFindoneUseCase.execute(id)

      expect(productRepositoryMock.getById).toHaveBeenCalledWith(id)
      expect(result).toEqual(mockProduct)
    })
  })
})
