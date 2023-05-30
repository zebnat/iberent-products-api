import { Repository } from 'typeorm'
import { User as UserTypeorm } from '../../../typeorm-entities/User'
import { UserRepositoryTypeormAdapter } from './user.repository.typeorm-adapter'
import { User } from '../domain'

describe('UserRepositoryTypeormAdapter', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('methods', () => {
    describe('save', () => {
      it('should call create and save methods from typeorm entity internally', () => {
        const mockOrm = {
          create: jest.fn().mockImplementation(() => {
            return { username: 'test', password: 'test' } as UserTypeorm
          }),
          save: jest.fn().mockImplementation(() => {
            const fakeResult: UserTypeorm = {
              id: 1,
              username: 'newuser',
              password: 'newpassword',
            }
            return fakeResult
          }),
        }

        const adapter = new UserRepositoryTypeormAdapter(
          mockOrm as unknown as Repository<UserTypeorm>,
        )
        const user: User = { name: 'testname', password: 'testpassword' }
        adapter.save(user)

        expect(mockOrm.create).toHaveBeenCalledTimes(1)
        expect(mockOrm.save).toHaveBeenCalledTimes(1)
      })

      it('should reject when save goes wrong internally', () => {
        const mockOrm = {
          create: jest.fn().mockImplementation(() => {
            return { username: 'test', password: 'test' } as UserTypeorm
          }),
          save: jest.fn().mockImplementation(() => {
            throw new Error('Library error')
          }),
        }

        const adapter = new UserRepositoryTypeormAdapter(
          mockOrm as unknown as Repository<UserTypeorm>,
        )

        const user: User = { name: 'testname', password: 'testpassword' }
        const promise = adapter.save(user)

        expect(promise).rejects.toThrow('Library error')
      })

      it('should reject when a user is not returned', () => {
        const mockOrm = {
          create: jest.fn().mockImplementation(() => {
            return { username: 'test', password: 'test' } as UserTypeorm
          }),
          save: jest.fn().mockImplementation(() => {
            return null
          }),
        }

        const adapter = new UserRepositoryTypeormAdapter(
          mockOrm as unknown as Repository<UserTypeorm>,
        )

        const user: User = { name: 'testname', password: 'testpassword' }

        const promise = adapter.save(user)

        expect(promise).rejects.toThrow()
      })
    })

    describe('getByNameAndPassword', () => {
      it('should return an user domain entity without any issues', async () => {
        const mockOrm = {
          findOneByOrFail: jest.fn().mockImplementation(() => {
            return {
              id: 421432,
              username: 'admin',
              password: 'admin',
            } as UserTypeorm
          }),
        }

        const adapter = new UserRepositoryTypeormAdapter(
          mockOrm as unknown as Repository<UserTypeorm>,
        )
        const userDomain = await adapter.getByNameAndPassword('admin', 'admin')

        expect(userDomain.name).toEqual('admin')
        expect(userDomain.password).toEqual('admin')
        expect(
          adapter.getByNameAndPassword('admin', 'admin'),
        ).resolves.not.toThrow()
      })

      it('should reject when orm rejects', () => {
        const expectedError = 'Unable to find user'

        const mockOrm = {
          findOneByOrFail: jest.fn().mockImplementation(() => {
            throw new Error(expectedError)
          }),
        }

        const adapter = new UserRepositoryTypeormAdapter(
          mockOrm as unknown as Repository<UserTypeorm>,
        )

        expect(
          adapter.getByNameAndPassword('fewrfwerf', 'adefdfemin'),
        ).rejects.toThrowError(expectedError)
      })
    })
  })
})
