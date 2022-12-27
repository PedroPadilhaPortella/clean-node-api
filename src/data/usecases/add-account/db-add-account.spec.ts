import { DbAddAccount } from "./db-add-account"
import { AccountModel, AddAccountModel, AddAccountRepository, Hasher, LoadAccountByEmailRepository } from "./db-add-account.protocols"

const createLoadAccount = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel | null> {
      return null
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const createHasherStub = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return await new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new HasherStub()
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
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = createHasherStub()
  const addAccountRepositoryStub = createAddAccountRepositoryStub()
  const loadAccountByEmailRepositoryStub = createLoadAccount()
  const sut = new DbAddAccount(addAccountRepositoryStub, loadAccountByEmailRepositoryStub, hasherStub)
  return { sut, hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub }
}

const makeFakeAccount = (): AddAccountModel => ({
  name: 'name', 
  email: 'email@mail.com', 
  password: 'pass123'
})

describe('DbAddAccount', () => {
  
  it('should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    const account = makeFakeAccount()
    await sut.add(account)
    expect(hashSpy).toHaveBeenCalledWith('pass123')
  })

  it('should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash')
      .mockResolvedValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const account = makeFakeAccount()
    const response = sut.add(account)
    await expect(response).rejects.toThrow()
  })

  it('should call AddAccountRepository', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addAccountRepositorySpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const account = makeFakeAccount()
    await sut.add(account)
    expect(addAccountRepositorySpy).toHaveBeenCalledWith({ ...account, password: 'hashed_password' })
  })
  
  it('should throw if addAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add')
      .mockResolvedValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const account = makeFakeAccount()
    const response = sut.add(account)
    await expect(response).rejects.toThrow()
  })
    
  it('should call AddAccountRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    const account = makeFakeAccount()
    await sut.add(account)
    expect(loadSpy).toBeCalledWith(account.email)
  })
  
  it('should return null if loadAccountByEmailRepository returns an account', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(new Promise(resolve => resolve({ id: '1', ...makeFakeAccount() })))
    const account = makeFakeAccount()
    const response = await sut.add(account)
    expect(response).toBeNull()
  })
    
  it('should return an account on success', async () => {
    const { sut } = makeSut()
    const account = makeFakeAccount()
    const response = await sut.add(account)
    expect(response).toEqual({ id: '1', ...account, password: 'hashed_password' })
  })
})