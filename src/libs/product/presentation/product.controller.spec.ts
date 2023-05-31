import { ProductService } from '../application/product.service'
import { createProductDTO } from '../application/create.product.dto'
import { Product } from '../domain'
import { DeleteProductDTO } from '../application/delete.product.dto'
import { updateProductDTO } from '../application/update.product.dto'
import { ProductController } from './product.controller'

describe('ProductController', () => {
  let productServiceMock: ProductService
  let productController: ProductController

  beforeEach(() => {
    jest.clearAllMocks()

    // Set up any necessary dependencies or mocks
    productServiceMock = {
      createProduct: jest.fn(),
      updateProduct: jest.fn(),
      deleteProduct: jest.fn(),
      getAll: jest.fn(),
      findProductById: jest.fn(),
    } as unknown as ProductService

    productController = new ProductController(productServiceMock)
  })

  describe('postProduct', () => {
    it('should create a new product', async () => {
      const createProductDTO: createProductDTO = {
        name: 'New Product',
        description: 'New Description',
        price: 999,
        stock: 10,
      }

      const createdProduct: Product = {
        id: 1,
        name: createProductDTO.name,
        description: createProductDTO.description,
        price: createProductDTO.price,
        stock: createProductDTO.stock,
      }

      // Mock the productService.createProduct method
      productServiceMock.createProduct = jest
        .fn()
        .mockResolvedValue(createdProduct)

      const result = await productController.postProduct(createProductDTO)

      expect(productServiceMock.createProduct).toHaveBeenCalledWith(
        createProductDTO,
      )
      expect(result).toEqual(createdProduct)
    })

    it('should reject with an error if invalid parameters are provided', async () => {
      const createProductDTO: createProductDTO = {
        name: 'New Product',
        description: 'New Description',
        price: null,
        stock: 10,
      }

      // Call the method and expect it to reject with an error
      await expect(
        productController.postProduct(createProductDTO),
      ).rejects.toThrowError('Invalid Parameters')
    })
  })

  describe('updateProduct', () => {
    it('should update an existing product', async () => {
      const updateProductDTO: updateProductDTO = {
        id: 1,
        name: 'Updated Product',
        description: 'Updated Description',
        price: 1999,
        stock: 20,
      }

      const updatedProduct: Product = {
        id: updateProductDTO.id,
        name: updateProductDTO.name,
        description: updateProductDTO.description,
        price: updateProductDTO.price,
        stock: updateProductDTO.stock,
      }

      // Mock the productService.updateProduct method
      productServiceMock.updateProduct = jest
        .fn()
        .mockResolvedValue(updatedProduct)

      const result = await productController.updateProduct(updateProductDTO)

      expect(productServiceMock.updateProduct).toHaveBeenCalledWith(
        updateProductDTO,
      )
      expect(result).toEqual(updatedProduct)
    })

    it('should reject with an error if invalid parameters are provided', async () => {
      const updateProductDTO: updateProductDTO = {
        id: null,
        name: 'Updated Product',
        description: 'Updated Description',
        price: 1999,
        stock: 20,
      }

      // Call the method and expect it to reject with an error
      await expect(
        productController.updateProduct(updateProductDTO),
      ).rejects.toThrowError('Invalid Parameters')
    })
  })

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const productId: DeleteProductDTO = 10

      // Call the method and expect it to resolve
      await expect(productController.deleteProduct(productId)).resolves.toBe(
        true,
      )
      expect(productServiceMock.deleteProduct).toHaveBeenCalledWith(productId)
    })

    it('should reject with an error if invalid parameters are provided', async () => {
      const productId: DeleteProductDTO = null

      // Call the method and expect it to reject with an error
      await expect(
        productController.deleteProduct(productId),
      ).rejects.toThrowError('Invalid Parameters')
    })
  })
})
