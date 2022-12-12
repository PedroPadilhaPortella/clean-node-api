import { InternalServerError, MissingParamError } from '../../errors'
import { HttpRequest } from './../../protocols/http.interface'
import { LoginController } from './login'
import { Authentication, Validation, BadRequest, Ok, ServerError, Unauthorized, AuthenticationModel } from './login.protocols'

const createAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async authenticate (authentication: AuthenticationModel): Promise<string> {
      return 'login_token'
    }
  }
  return new AuthenticationStub()
}

const createValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const authenticationStub = createAuthenticationStub()
  const validationStub = createValidation()
  const sut = new LoginController(authenticationStub, validationStub)
  return { sut, validationStub, authenticationStub }
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'pedro@gmail.com', 
    password: 'senha123'
  }
})

describe('Login Controller', () => {

  it('should call authenticate with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'authenticate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(authSpy)
      .toHaveBeenCalledWith({ email: httpRequest.body.email, password: httpRequest.body.password })
  })
  
  it('should return 401 if invalid credentials provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'authenticate').mockReturnValueOnce(new Promise(resolve => resolve('')))
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(Unauthorized())
  })

  it('should return 500 if authenticate throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'authenticate')
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new InternalServerError('Erro'))))
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ServerError(new InternalServerError('Erro')))
  })

  it('should call validation with correct body', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
  
  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(BadRequest(new MissingParamError('any_field')))
  })
    
  it('should return 200 when valid fields are provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(Ok({ accessToken: 'login_token' }))
  })
})
