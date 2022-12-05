import { DbAddAccount } from "./db-add-account"
import { Encrypter, AddAccountModel, AccountModel, AddAccountRepository } from "./db-add-account.protocols"

const createEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new EncrypterStub()
}

const createAddAccountRepositoryStub = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => resolve({ ...account, id: '1', password: 'hashed_password' }))
    }
  }
  return new AddAccountRepositoryStub()
}

interface SutTypes {
  sut: DbAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const encrypterStub = createEncrypterStub()
  const addAccountRepositoryStub = createAddAccountRepositoryStub()
  const sut = new DbAddAccount(addAccountRepositoryStub, encrypterStub)
  return { sut, encrypterStub, addAccountRepositoryStub }
}

describe('DbAddAccount', () => {
  
  it('should call encripter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const account = { name: 'name', email: 'email@mail.com', password: 'pass123' }

    await sut.add(account)
    expect(encryptSpy).toHaveBeenCalledWith('pass123')
  })

  it('should throw if encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt')
      .mockResolvedValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const account = { name: 'name', email: 'email@mail.com', password: 'pass123' }

    const response = sut.add(account)
    await expect(response).rejects.toThrow()
  })

  it('should call AddAccountRepository', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addAccountRepositorySpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const account = { name: 'name', email: 'email@mail.com', password: 'pass123' }

    await sut.add(account)
    expect(addAccountRepositorySpy).toHaveBeenCalledWith({ ...account, password: 'hashed_password' })
  })
  
  it('should throw if addAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add')
      .mockResolvedValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const account = { name: 'name', email: 'email@mail.com', password: 'pass123' }

    const response = sut.add(account)
    await expect(response).rejects.toThrow()
  })
    
  it('should return an account on success', async () => {
    const { sut } = makeSut()
    const account = { name: 'name', email: 'email@mail.com', password: 'pass123' }

    const response = await sut.add(account)
    expect(response).toEqual({ id: '1', ...account, password: 'hashed_password' })
  })
})