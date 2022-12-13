import { Authentication } from '../../../domain/usecases/authentication.interface'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-repository.interface'
import { AccountModel } from './../../../domain/models/account.model'
import { DbAuthentication } from './db-authentication'

const autentication = { email: 'email@mail.com', password: 'pass123' }

const createLoadAccount = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      return { id: '1', email, name: 'name', password: 'pass123' }
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

interface SutTypes {
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  sut: Authentication
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = createLoadAccount()
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
  return { sut, loadAccountByEmailRepositoryStub }
}

describe('DbAuthentication', () => { 
  
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.authenticate(autentication)
    expect(loadSpy).toBeCalledWith(autentication.email)
  })
})