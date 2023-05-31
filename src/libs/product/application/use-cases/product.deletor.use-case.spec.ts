import { ProductRepository } from '../../domain'
import { ProductDeletorUseCase } from './product.deletor.use-case'
import { DeleteProductDTO } from '../delete.product.dto'

describe('ProductDeletorUseCase', () => {
  let productRepositoryMock: ProductRepository
  let productDeletorUseCase: ProductDeletorUseCase

  beforeEach(() => {
    jest.resetAllMocks()

    // Set up any necessary dependencies or mocks
    productRepositoryMock = {
      deleteById: jest.fn(),
      save: null,
      getAll: null,
      getById: null,
    }
    productDeletorUseCase = new ProductDeletorUseCase(productRepositoryMock)
  })

  describe('execute', () => {
    it('should delete a product with the provided ID', async () => {
      const id: DeleteProductDTO = 11 // Example ID

      await productDeletorUseCase.execute(id)

      expect(productRepositoryMock.deleteById).toHaveBeenCalledWith(id)
    })
  })
})
