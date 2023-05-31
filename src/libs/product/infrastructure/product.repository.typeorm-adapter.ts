import { Repository } from 'typeorm'
import { Product as ProductTypeorm } from '../../../typeorm-entities/Product'
import { Product, ProductRepository } from '../domain'

export class ProductRepositoryTypeormAdapter implements ProductRepository {
  constructor(public orm: Repository<ProductTypeorm>) {}

  async getAll(): Promise<Product[]> {
    const productsOrm = (await this.orm.find()).sort((a, b) => b.id - a.id)
    const products = productsOrm.map((item) => {
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        stock: item.stock,
      } as Product
    })
    return products
  }

  async getById(id: number): Promise<Product> {
    const product = await this.orm.findOneBy({ id: id })
    return product
  }

  async save(product: Product): Promise<Product> {
    const productTypeorm = this.orm.create()
    let update = false
    if (product.id) {
      // it will update
      update = true
    }

    productTypeorm.name = product.name
    productTypeorm.description = product.description
    productTypeorm.price = product.price
    productTypeorm.stock = product.stock

    let savedTypeorm
    if (update) {
      const res = await this.orm.update({ id: product.id }, productTypeorm)
      savedTypeorm = { ...product, ...{ id: parseInt(product.id.toString()) } }
    } else {
      savedTypeorm = await this.orm.save(productTypeorm)
    }

    return savedTypeorm as Product
  }

  async deleteById(id: number): Promise<void> {
    const result = await this.orm
      .createQueryBuilder('products')
      .delete()
      .from(ProductTypeorm)
      .where('id = :id', { id: id })
      .execute()

    if (result.affected == 0)
      throw new Error('Id does not exists. Nothing was removed')
  }
}
