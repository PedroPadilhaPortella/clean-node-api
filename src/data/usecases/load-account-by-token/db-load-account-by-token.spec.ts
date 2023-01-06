import { AccountModel } from './../../../domain/models/account.model'
import { LoadAccountByToken } from './../../../domain/usecases/load-account-by-token.interface'
import { DbLoadAcccountByToken } from './db-load-account-by-token'
import { Decrypter } from './../../protocols/decrypter.interface'
import { LoadAccountByTokenRepository } from './../../../data/protocols/load-account-by-token-repository.interface'

const account: AccountModel = {
  id: '1',
  name: 'pedro',
  email: 'email@mail.com',
  password: 'pass123'
}

const createDecrypterStub = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return 'decrypted_token'
    }
  }
  return new DecrypterStub()
}

const createLoadAccountByTokenRepositoryStub = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel> {
      return account
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

interface SutTypes {
  sut: LoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: any
}

const makeSut = (): SutTypes => {
  const decrypterStub = createDecrypterStub()
  const loadAccountByTokenRepositoryStub = createLoadAccountByTokenRepositoryStub()
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
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const response = await sut.load('token', 'role')
    expect(response).toBeNull()
  })

  it('should call loadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await sut.load('token', 'role')
    expect(loadSpy).toHaveBeenCalledWith('decrypted_token', 'role')
  })

  it('should return null if loadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
      .mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const response = await sut.load('token', 'role')
    expect(response).toBeNull()
  })
})