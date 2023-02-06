import { DbAuthentication } from './db-authentication'
import { ACCOUNT, Authentication, Encrypter, HashComparer, LoadAccountByEmailRepository, LOGIN, mockEncrypter, mockHashCompare, mockLoadAccountByEmail, mockUpdateAccessTokenRepository, throwError, UpdateAccessTokenRepository } from './db-authentication.protocols'

type SutTypes = {
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashCompareStub: HashComparer
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
  sut: Authentication
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmail()
  const hashCompareStub = mockHashCompare()
  const encrypterStub = mockEncrypter()
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository()

  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub, 
    hashCompareStub, 
    encrypterStub,
    updateAccessTokenRepositoryStub
  )

  return { 
    sut, 
    loadAccountByEmailRepositoryStub, 
    hashCompareStub, 
    encrypterStub, 
    updateAccessTokenRepositoryStub 
  }
}

describe('DbAuthentication', () => { 
  
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.authenticate(LOGIN)
    expect(loadSpy).toBeCalledWith(LOGIN.email)
  })
  
  it('should throw if loadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockImplementationOnce(throwError)
    const response = sut.authenticate(LOGIN)
    await expect(response).rejects.toThrow()
  })
  
  it('should return null if loadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockReturnValue(Promise.resolve(null))
    const response = await sut.authenticate(LOGIN)
    expect(response).toBeNull()
  })
  
  it('should call HashCompare with correct values', async () => {
    const { sut, hashCompareStub } = makeSut()
    const compareSpy = jest.spyOn(hashCompareStub, 'compare')
    await sut.authenticate(LOGIN)
    expect(compareSpy).toHaveBeenCalledWith(LOGIN.password, LOGIN.password)
  })  

  it('should throw if HashCompare throws', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockImplementationOnce(throwError)
    const response = sut.authenticate(LOGIN)
    await expect(response).rejects.toThrow()
  })

  it('should return null if HashCompare returns false', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const response = await sut.authenticate(LOGIN)
    expect(response).toBeNull()
  })

  it('should call Encrypter with correct id', async () => {
    const { sut, encrypterStub } = makeSut()
    const tokenSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.authenticate(LOGIN)
    expect(tokenSpy).toHaveBeenCalledWith('1')
  })

  it('should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(throwError)
    const response = sut.authenticate(LOGIN)
    await expect(response).rejects.toThrow()
  })
  
  it('should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateToken')
    await sut.authenticate(LOGIN)
    expect(updateSpy).toHaveBeenCalledWith('1', 'token')
  })
  
  it('should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateToken').mockImplementationOnce(throwError)
    const response = sut.authenticate(LOGIN)
    await expect(response).rejects.toThrow()
  })
  
  it('should return an accessToken and the name on success', async () => {
    const { sut } = makeSut()
    const response = await sut.authenticate(LOGIN)
    expect(response).toEqual({ accessToken: 'token', name: ACCOUNT.name })
  })
})