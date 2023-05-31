import { SelectQueryBuilder } from 'typeorm'
import { Product as ProductTypeorm } from '../../../typeorm-entities/Product'
import { ProductRepositoryTypeormAdapter } from './product.repository.typeorm-adapter'
import { Product } from '../domain'

describe('ProductRepositoryTypeormAdapter', () => {
  let adapter: ProductRepositoryTypeormAdapter = null

  beforeEach(() => {
    jest.resetAllMocks()
    let repo = jest.fn() as any // mock repo/orm
    adapter = new ProductRepositoryTypeormAdapter(repo)
  })

  describe('methods', () => {
    describe('save', () => {
      it('should call orm methods create and save', async () => {
        // Mock the necessary dependencies
        const createMock = jest.fn().mockReturnValue(new ProductTypeorm())
        const saveMock = jest.fn().mockReturnValue(new ProductTypeorm())

        adapter.orm.create = createMock
        adapter.orm.save = saveMock

        const product: Product = {
          name: 'Test Product',
          description: 'Test description',
          price: 999,
          stock: 10,
        }

        const result = await adapter.save(product)
        expect(adapter.orm.create).toHaveBeenCalledTimes(1)
        expect(
          (adapter.orm.create as jest.Mock).mock.results[0].value,
        ).toBeInstanceOf(ProductTypeorm)
        expect(adapter.orm.save).toHaveBeenCalledWith(
          (adapter.orm.create as jest.Mock).mock.results[0].value,
        )
      })
    })

    describe('getById', () => {
      it('should have called orm findOneBy', async () => {
        const ormFoundProductObject = {
          id: 4,
          name: 'name',
          description: 'desc',
          price: 10,
          stock: 400,
        } as ProductTypeorm
        const findMock = jest.fn().mockResolvedValue(ormFoundProductObject)
        adapter.orm.findOneBy = findMock

        const returnedValue = await adapter.getById(2)

        expect(adapter.orm.findOneBy).toHaveBeenCalledTimes(1)
        expect(returnedValue.id).toEqual(ormFoundProductObject.id)
      })
    })

    describe('deleteById', () => {
      it('should delete a product with the given ID', async () => {
        // Mock the necessary dependencies
        const deleteMock = jest.fn().mockReturnThis()
        const fromMock = jest.fn().mockReturnThis()
        const whereMock = jest.fn().mockReturnThis()
        const executeMock = jest.fn().mockResolvedValue({ affected: 1 })

        const queryBuilderMock = {
          delete: deleteMock,
          from: fromMock,
          where: whereMock,
          execute: executeMock,
        }
        adapter.orm.createQueryBuilder = jest.fn()
        // Mock the required ORM methods
        jest
          .spyOn(adapter.orm, 'createQueryBuilder')
          .mockReturnValue(
            queryBuilderMock as unknown as SelectQueryBuilder<ProductTypeorm>,
          )

        const id = 123
        await adapter.deleteById(id)

        expect(adapter.orm.createQueryBuilder).toHaveBeenCalledWith('products')
        expect(queryBuilderMock.delete).toHaveBeenCalled()
        expect(queryBuilderMock.from).toHaveBeenCalledWith(ProductTypeorm)
        expect(whereMock).toHaveBeenCalledWith('id = :id', { id })
        expect(executeMock).toHaveBeenCalled()
      })
    })

    describe('getAll', () => {
      it('should have called orm find to find products and returned array value', async () => {
        const findMock = jest
          .fn()
          .mockResolvedValue([
            { id: 4, name: 'name', description: 'desc', price: 10, stock: 400 },
          ] as ProductTypeorm[])
        adapter.orm.find = findMock

        const returnedValue = await adapter.getAll()

        expect(adapter.orm.find).toHaveBeenCalledTimes(1)
        expect(returnedValue[0].name).toEqual('name')
      })
    })
  })
})
