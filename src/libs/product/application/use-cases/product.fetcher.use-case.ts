import { Product, ProductRepository } from '../../domain'

export class ProductFetcherUseCase {
  constructor(private productRepository: ProductRepository) {}

  public async execute(): Promise<Product[]> {
    return await this.productRepository.getAll()
  }
}
