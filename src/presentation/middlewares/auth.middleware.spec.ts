import { AuthMiddleware } from './auth.middleware'
import { AccessDeniedError, Forbidden, LoadAccountByToken, mockLoadAccountByToken, throwError } from "./middlewares.protocols"

const fakeRequest: AuthMiddleware.Request = { accessToken: '_token_' }

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = mockLoadAccountByToken()
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
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(Promise.resolve(null))
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
    jest.spyOn(loadAccountByTokenStub, 'load').mockImplementationOnce(throwError)
    const response = await sut.handle(fakeRequest)
    expect(response.statusCode).toEqual(500)
  })
})