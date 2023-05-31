import { Product, ProductRepository } from '../../domain'
import { ProductFetcherUseCase } from './product.fetcher.use-case'

describe('ProductFetcherUseCase', () => {
  let productRepositoryMock: ProductRepository
  let productFetcherUseCase: ProductFetcherUseCase

  beforeEach(() => {
    jest.restoreAllMocks()

    // Set up any necessary dependencies or mocks
    productRepositoryMock = {
      getAll: jest.fn(),
      deleteById: null,
      save: null,
      getById: null,
    }
    productFetcherUseCase = new ProductFetcherUseCase(productRepositoryMock)
  })

  describe('execute', () => {
    it('should fetch all products', async () => {
      const mockProducts: Product[] = [
        {
          id: 1,
          name: 'Product 1',
          description: 'Description 1',
          price: 999,
          stock: 10,
        },
        {
          id: 2,
          name: 'Product 2',
          description: 'Description 2',
          price: 1999,
          stock: 5,
        },
      ]

      // Mock the productRepository.getAll method
      ;(productRepositoryMock.getAll as jest.Mock).mockResolvedValue(
        mockProducts,
      )

      const result = await productFetcherUseCase.execute()

      expect(productRepositoryMock.getAll).toHaveBeenCalledTimes(1)
      expect(result).toEqual(mockProducts)
    })
  })
})
