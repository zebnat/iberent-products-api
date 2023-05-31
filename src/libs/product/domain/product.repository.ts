import { Product } from './product.entity'

export interface ProductRepository {
  getAll(): Promise<Product[]>
  getById(id: number): Promise<Product | null>
  save(product: Product): Promise<Product>
  deleteById(id: number): Promise<void>
}
