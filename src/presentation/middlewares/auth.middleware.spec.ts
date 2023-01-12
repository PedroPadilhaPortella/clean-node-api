import { AuthMiddleware } from './auth.middleware'
import { AccessDeniedError, AccountModel, Forbidden, HttpRequest, LoadAccountByToken, ACCOUNT } from "./middlewares.protocols"

const fakeRequest: HttpRequest = { headers: { 'x-access-token': '_token_' }, body: {} }

const createLoadAccountByTokenStub = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (token: string, role?: string | undefined): Promise<AccountModel | null> {
      return ACCOUNT
    }
  }
  return new LoadAccountByTokenStub()
}

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = createLoadAccountByTokenStub()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)
  return { sut, loadAccountByTokenStub }
}

describe('Auth Middleware', () => {

  it('should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({})
    expect(response).toEqual(Forbidden(new AccessDeniedError()))
  })

  it('should call loadAccountByToken with correct accessToken', async () => {
    const role = 'admin'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(fakeRequest)
    expect(loadSpy).toHaveBeenCalledWith('_token_', 'admin')
  })

  it('should return 403 if loadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const response = await sut.handle(fakeRequest)
    expect(response).toEqual(Forbidden(new AccessDeniedError()))
  })

  it('should return 200 if loadAccountByToken returns an account', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(fakeRequest)
    expect(response.statusCode).toEqual(200)
  })

  it('should return 500 if loadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const response = await sut.handle(fakeRequest)
    expect(response.statusCode).toEqual(500)
  })
})