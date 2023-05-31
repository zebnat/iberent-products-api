import { ProductRepository, Product } from '../../domain'
import { createProductDTO } from '../create.product.dto'

export interface ProductCreatorUseCaseRequest extends createProductDTO {}

export interface ProductCreatorUseCaseResponse {
  id: number
  name: string
  description: string
  price: number
  stock: number
}

export class ProductCreatorUseCase {
  constructor(private productRepository: ProductRepository) {}

  public async execute(
    request: ProductCreatorUseCaseRequest,
  ): Promise<ProductCreatorUseCaseResponse> {
    const product: Product = {
      name: request.name,
      description: request.description,
      price: request.price,
      stock: request.stock,
    }

    const createdProduct = await this.productRepository.save(product)

    return {
      id: createdProduct.id,
      description: createdProduct.description,
      name: createdProduct.name,
      price: createdProduct.price,
      stock: createdProduct.stock,
    } as ProductCreatorUseCaseResponse
  }
}
