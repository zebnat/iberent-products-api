import { ProductService } from '../application/product.service'
import { createProductDTO } from '../application/create.product.dto'
import { Product } from '../domain'
import { DeleteProductDTO } from '../application/delete.product.dto'
import { FindOneProductDTO } from '../application/findone.product.dto'
import { updateProductDTO } from '../application/update.product.dto'

export class ProductController {
  private productService: ProductService
  constructor(productService: ProductService) {
    this.productService = productService
  }

  public async postProduct(product: createProductDTO): Promise<Product> {
    return new Promise(async (resolve, reject) => {
      // api request input validation
      if (
        !product.name ||
        !product.description ||
        !product.price ||
        !product.stock ||
        isNaN(product.price) ||
        isNaN(product.stock)
      ) {
        reject(new Error('Invalid Parameters'))
      }

      // using service
      try {
        const created = await this.productService.createProduct(product)
        resolve(created)
      } catch (err) {
        reject(err)
      }
    })
  }

  public async updateProduct(product: updateProductDTO) {
    return new Promise(async (resolve, reject) => {
      // api request input validation
      if (
        !product.id ||
        !product.name ||
        !product.description ||
        product.price == undefined ||
        product.stock == undefined ||
        isNaN(product.id) ||
        isNaN(product.price) ||
        isNaN(product.stock)
      ) {
        reject(new Error('Invalid Parameters'))
      }

      // using service
      try {
        const updated = await this.productService.updateProduct(product)
        resolve(updated)
      } catch (err) {
        reject(err)
      }
    })
  }

  public async deleteProduct(id: DeleteProductDTO) {
    return new Promise(async (resolve, reject) => {
      // api request input validation
      if (!id || isNaN(id)) {
        reject(new Error('Invalid Parameters'))
      }

      // using delete service
      try {
        await this.productService.deleteProduct(id)
        resolve(true)
      } catch (err) {
        reject(err)
      }
    })
  }

  public async getProducts() {
    return await this.productService.getAll()
  }

  public async getProductById(id: FindOneProductDTO) {
    return new Promise(async (resolve, reject) => {
      // api request input validation
      if (!id || isNaN(id)) {
        reject(new Error('Invalid Parameters'))
      }

      // using  service
      try {
        const product = await this.productService.findProductById(id)
        resolve(product)
      } catch (err) {
        reject(err)
      }
    })
  }
}
