import { ProductRepository } from '../../domain'
import { DeleteProductDTO } from '../delete.product.dto'

export class ProductDeletorUseCase {
  constructor(private productRepository: ProductRepository) {}

  public async execute(id: DeleteProductDTO): Promise<void> {
    const idtoBeDeleted: number = id

    await this.productRepository.deleteById(idtoBeDeleted)
  }
}
