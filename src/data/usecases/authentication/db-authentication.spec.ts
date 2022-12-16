import { Authentication } from '../../../domain/usecases/authentication.interface'
import { HashComparer } from '../../protocols/hash-comparer.interface'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-repository.interface'
import { AccountModel } from './../../../domain/models/account.model'
import { DbAuthentication } from './db-authentication'

const autentication = { email: 'email@mail.com', password: 'pass123' }

const createLoadAccount = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel | null> {
      return { id: '1', email, name: 'name', password: 'pass123' }
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const createHashCompare = (): HashComparer => {
  class HashCompareStub implements HashComparer {
    async compare (value: string, hash: string): Promise<boolean> {
      return true
    }
  }
  return new HashCompareStub()
}

interface SutTypes {
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashCompareStub: HashComparer
  sut: Authentication
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = createLoadAccount()
  const hashCompareStub = createHashCompare()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashCompareStub)
  return { sut, loadAccountByEmailRepositoryStub, hashCompareStub }
}

describe('DbAuthentication', () => { 
  
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.authenticate(autentication)
    expect(loadSpy).toBeCalledWith(autentication.email)
  })
  
  it('should throw if loadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error('error'))))
    const response = sut.authenticate(autentication)
    await expect(response).rejects.toThrow()
  })
  
  it('should return null if loadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
      .mockReturnValue(new Promise(resolve => resolve(null)))
    const response = await sut.authenticate(autentication)
    expect(response).toBeNull()
  })
  
  it('should call HashCompare with correct values', async () => {
    const { sut, hashCompareStub } = makeSut()
    const compareSpy = jest.spyOn(hashCompareStub, 'compare')
    await sut.authenticate(autentication)
    expect(compareSpy).toHaveBeenCalledWith(autentication.password, autentication.password)
  })  

  it('should throw if HashCompare throws', async () => {
    const { sut, hashCompareStub } = makeSut()
    jest.spyOn(hashCompareStub, 'compare')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error('error'))))
    const response = sut.authenticate(autentication)
    await expect(response).rejects.toThrow()
  })
})