import { DbLoadAcccountByToken } from './db-load-account-by-token'
import { ACCOUNT, Decrypter, LoadAccountByToken, LoadAccountByTokenRepository, mockDecrypter, mockLoadAccountByTokenRepository, throwError } from './db-load-account-by-token.protocols'

type SutTypes = {
  sut: LoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeSut = (): SutTypes => {
  const decrypterStub = mockDecrypter()
  const loadAccountByTokenRepositoryStub = mockLoadAccountByTokenRepository()
  const sut = new DbLoadAcccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)
  return { sut, decrypterStub, loadAccountByTokenRepositoryStub }
}

describe('DbLoadAccountByToken', () => {

  it('should call decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decrypterSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('token', 'role')
    expect(decrypterSpy).toHaveBeenCalledWith('token')
  })

  it('should return null if decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt')
      .mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.load('token', 'role')
    expect(response).toBeNull()
  })

  it('should return null if decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(throwError)
    const response = await sut.load('token', 'role')
    expect(response).toBeNull()
  })

  it('should call loadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await sut.load('token', 'role')
    expect(loadSpy).toHaveBeenCalledWith('token', 'role')
  })

  it('should return null if loadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.load('token', 'role')
    expect(response).toBeNull()
  })

  it('should return an account on success', async () => {
    const { sut } = makeSut()
    const response = await sut.load('token', 'role')
    expect(response).toEqual({ id: ACCOUNT.id })
  })
  
  it('should throw if loadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockImplementationOnce(throwError)
    const response = sut.load('token', 'role')
    await expect(response).rejects.toThrow()
  })
})