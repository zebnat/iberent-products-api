import { ProductCreatorUseCase } from './use-cases/product.creator.use-case'
import { AppDataSource } from '../../../data-source'
import { ProductRepositoryTypeormAdapter } from '../infrastructure/product.repository.typeorm-adapter'
import { Product as ProductTypeorm } from '../../../typeorm-entities/Product'
import { createProductDTO } from './create.product.dto'
import { Product } from '../domain'
import { ProductDeletorUseCase } from './use-cases/product.deletor.use-case'
import { DeleteProductDTO } from './delete.product.dto'
import { ProductFindoneUseCase } from './use-cases/product.findone.use-case'
import { FindOneProductDTO } from './findone.product.dto'
import { ProductUpdaterUseCase } from './use-cases/product.updater.use-case'
import { updateProductDTO } from './update.product.dto'
import { ProductFetcherUseCase } from './use-cases/product.fetcher.use-case'

/**
 * Helper Service to gather all functionality and application usecases
 */
export class ProductService {
  private productCreator: ProductCreatorUseCase
  private productUpdater: ProductUpdaterUseCase
  private productDeletor: ProductDeletorUseCase
  private productFindone: ProductFindoneUseCase
  private productFetcher: ProductFetcherUseCase

  constructor() {
    const productTypeormAdapter = new ProductRepositoryTypeormAdapter(
      AppDataSource.getRepository(ProductTypeorm),
    )

    this.productCreator = new ProductCreatorUseCase(productTypeormAdapter)

    this.productDeletor = new ProductDeletorUseCase(productTypeormAdapter)

    this.productFindone = new ProductFindoneUseCase(productTypeormAdapter)

    this.productUpdater = new ProductUpdaterUseCase(productTypeormAdapter)

    this.productFetcher = new ProductFetcherUseCase(productTypeormAdapter)
  }

  public async createProduct(product: createProductDTO): Promise<Product> {
    const response = await this.productCreator.execute(product)

    const createdProduct: Product = {
      id: response.id,
      name: response.name,
      description: response.description,
      price: response.price,
      stock: response.stock,
    }
    return createdProduct
  }

  public async deleteProduct(id: DeleteProductDTO): Promise<void> {
    await this.productDeletor.execute(id)
  }

  public async findProductById(id: FindOneProductDTO): Promise<Product> {
    return await this.productFindone.execute(id)
  }

  public async getAll(): Promise<Product[]> {
    return await this.productFetcher.execute()
  }

  public async updateProduct(product: updateProductDTO): Promise<Product> {
    const response = await this.productUpdater.execute(product)

    const updatedProduct: Product = {
      id: response.id,
      name: response.name,
      description: response.description,
      price: response.price,
      stock: response.stock,
    }

    return updatedProduct
  }
}
