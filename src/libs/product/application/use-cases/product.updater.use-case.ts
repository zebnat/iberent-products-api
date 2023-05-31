import { ProductRepository, Product } from '../../domain'
import { updateProductDTO } from '../update.product.dto'

export interface ProductUpdaterUseCaseRequest extends updateProductDTO {}

export interface ProductUpdaterUseCaseResponse {
  id: number
  name: string
  description: string
  price: number
  stock: number
}

export class ProductUpdaterUseCase {
  constructor(private productRepository: ProductRepository) {}

  public async execute(
    request: ProductUpdaterUseCaseRequest,
  ): Promise<ProductUpdaterUseCaseResponse> {
    const product: Product = {
      id: request.id,
      name: request.name,
      description: request.description,
      price: request.price,
      stock: request.stock,
    }

    const updatedProduct = await this.productRepository.save(product)

    return {
      id: updatedProduct.id,
      description: updatedProduct.description,
      name: updatedProduct.name,
      price: updatedProduct.price,
      stock: updatedProduct.stock,
    } as ProductUpdaterUseCaseResponse
  }
}
