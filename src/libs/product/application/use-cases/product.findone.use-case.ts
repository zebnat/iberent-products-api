import { Product, ProductRepository } from '../../domain'
import { FindOneProductDTO } from '../findone.product.dto'

export class ProductFindoneUseCase {
  constructor(private productRepository: ProductRepository) {}

  public async execute(id: FindOneProductDTO): Promise<Product> {
    const idtoBeFetched: number = id

    return await this.productRepository.getById(idtoBeFetched)
  }
}
