import { LoginController } from './login.controller'
import { Authentication, BadRequest, InternalServerError, MissingParamError, Ok, ServerError, Unauthorized, Validation, mockAuthentication, mockValidation, throwInternalServerError, AUTHENTICATION, LOGIN } from './login.protocols'

type SutTypes = {
  sut: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const authenticationStub = mockAuthentication()
  const validationStub = mockValidation()
  const sut = new LoginController(authenticationStub, validationStub)
  return { sut, validationStub, authenticationStub }
}

const makeFakeRequest = (): LoginController.Request => ({ ...LOGIN })

describe('Login Controller', () => {

  it('should call authenticate with correct values', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'authenticate')
    const request = makeFakeRequest()
    await sut.handle(request)
    expect(authSpy)
      .toHaveBeenCalledWith({ email: request.email, password: request.password })
  })
  
  it('should return 401 if invalid credentials provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'authenticate').mockReturnValueOnce(Promise.resolve(null))
    const request = makeFakeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(Unauthorized())
  })

  it('should return 500 if authenticate throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'authenticate')
      .mockImplementationOnce(throwInternalServerError)
    const request = makeFakeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(ServerError(new InternalServerError('Error')))
  })

  it('should call validation with correct body', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const request = makeFakeRequest()
    await sut.handle(request)
    expect(validateSpy).toHaveBeenCalledWith(request)
  })
  
  it('should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const request = makeFakeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(BadRequest(new MissingParamError('any_field')))
  })
    
  it('should return 200 when valid fields are provided', async () => {
    const { sut } = makeSut()
    const request = makeFakeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(Ok(AUTHENTICATION))
  })
})
