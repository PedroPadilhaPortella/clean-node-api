import { DbAddAccount } from "./db-add-account"
import { AddAccountRepository, ADD_ACCOUNT, Hasher, LoadAccountByEmailRepository, mockAddAccountRepository, mockHasher, mockLoadAccountByEmail, throwError } from "./db-add-account.protocols"

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const addAccountRepositoryStub = mockAddAccountRepository()
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmail()
  jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    .mockReturnValue(new Promise(resolve => resolve(null)))
  const sut = new DbAddAccount(addAccountRepositoryStub, loadAccountByEmailRepositoryStub, hasherStub)
  return { sut, hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub }
}

describe('DbAddAccount', () => {
  
  it('should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(ADD_ACCOUNT)
    expect(hashSpy).toHaveBeenCalledWith(ADD_ACCOUNT.password)
  })

  it('should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(throwError)
    const response = sut.add(ADD_ACCOUNT)
    await expect(response).rejects.toThrow()
  })

  it('should call AddAccountRepository', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addAccountRepositorySpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(ADD_ACCOUNT)
    expect(addAccountRepositorySpy).toHaveBeenCalledWith({ ...ADD_ACCOUNT, password: 'hash' })
  })
  
  it('should throw if addAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(throwError)
    const response = sut.add(ADD_ACCOUNT)
    await expect(response).rejects.toThrow()
  })
    
  it('should call AddAccountRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(ADD_ACCOUNT)
    expect(loadSpy).toBeCalledWith(ADD_ACCOUNT.email)
  })
  
  it('should return null if loadAccountByEmailRepository returns an account', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValueOnce(new Promise(resolve => resolve({ id: '1', ...ADD_ACCOUNT })))
    const response = await sut.add(ADD_ACCOUNT)
    expect(response).toBeNull()
  })
    
  it('should return an account on success', async () => {
    const { sut } = makeSut()
    const response = await sut.add(ADD_ACCOUNT)
    expect(response).toEqual({ id: '1', ...ADD_ACCOUNT, password: 'hash' })
  })
})