import { LoadAccountByEmailRepository } from '../../protocols/load-account-repository.interface'
import { AccountModel } from './../../../domain/models/account.model'
import { DbAuthentication } from './db-authentication'

class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {

  async load (email: string): Promise<AccountModel> {
    return { id: '1', email, name: 'name', password: 'pass123' }
  }
}

describe('DbAuthentication', () => { 
  
  it('should call LoadAccountByEmailRepository with correct email', async () => {
    const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub()
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub)
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await sut.authenticate({ email: 'email@mail.com', password: 'pass123' })
    expect(loadSpy).toBeCalledWith('email@mail.com')
  })
})