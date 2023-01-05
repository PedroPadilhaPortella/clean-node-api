import { AccessDeniedError } from '../errors'
import { Forbidden } from './../helpers/http/http.helper'
import { AuthMiddleware } from './auth.middleware'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token.interface'
import { AccountModel } from '../../domain/models/account.model'

const account = { id: '1', email: 'pedro@gmail.com', name: 'pedro', password: 'pedro123' }

const createLoadAccountByTokenStub = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (token: string, role?: string | undefined): Promise<AccountModel | null> {
      return account
    }
  }
  return new LoadAccountByTokenStub()
}

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = createLoadAccountByTokenStub()
  const sut = new AuthMiddleware(loadAccountByTokenStub)
  return { sut, loadAccountByTokenStub }
}

describe('Auth Middleware', () => {

  it('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({})
    expect(response).toEqual(Forbidden(new AccessDeniedError()))
  })

  it('should call loadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    const httpRequest = { headers: { 'x-access-token': '_token_' } }
    await sut.handle(httpRequest)
    expect(loadSpy).toHaveBeenCalledWith('_token_')
  })
})