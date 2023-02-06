import { DbAddAccount } from "./db-add-account"
import { AddAccountRepository, ADD_ACCOUNT, CheckAccountByEmailRepository, Hasher, mockAddAccountRepository, mockCheckAccountByEmail, mockHasher, throwError } from "./db-add-account.protocols"

type SutTypes = {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  checkAccountByEmailRepositoryStub: CheckAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = mockHasher()
  const addAccountRepositoryStub = mockAddAccountRepository()
  const checkAccountByEmailRepositoryStub = mockCheckAccountByEmail()
  jest.spyOn(checkAccountByEmailRepositoryStub, 'checkByEmail')
    .mockReturnValue(Promise.resolve(null))
  const sut = new DbAddAccount(addAccountRepositoryStub, checkAccountByEmailRepositoryStub, hasherStub)
  return { sut, hasherStub, addAccountRepositoryStub, checkAccountByEmailRepositoryStub }
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
    const { sut, checkAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(checkAccountByEmailRepositoryStub, 'checkByEmail')
    await sut.add(ADD_ACCOUNT)
    expect(loadSpy).toBeCalledWith(ADD_ACCOUNT.email)
  })
  
  it('should return null if loadAccountByEmailRepository returns true', async () => {
    const { sut, checkAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(checkAccountByEmailRepositoryStub, 'checkByEmail')
      .mockReturnValueOnce(Promise.resolve(true))
    const response = await sut.add(ADD_ACCOUNT)
    expect(response).toBeNull()
  })
    
  it('should return an account on success', async () => {
    const { sut } = makeSut()
    const response = await sut.add(ADD_ACCOUNT)
    expect(response).toEqual({ id: '1', ...ADD_ACCOUNT, password: 'hash' })
  })
})