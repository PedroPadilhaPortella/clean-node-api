import { SignUpController } from './signup.controller'
import { AddAccount, AUTHENTICATION, Authentication, BadRequest, EmailAlreadyTaken, Forbidden, InternalServerError, MissingParamError, mockAddAccount, mockAuthentication, mockValidation, Ok, ServerError, SIGNUP, throwInternalServerError, Unauthorized, Validation } from './signup.protocols'

type SutTypes = {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const addAccountStub = mockAddAccount()
  const validationStub = mockValidation()
  const authenticationStub = mockAuthentication()
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)
  return { sut, addAccountStub, validationStub, authenticationStub }
}

const makeFakeRequest = (): SignUpController.Request => ({ ...SIGNUP })

describe('SignUp Controller', () => {
  
  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const AddAccountSpy = jest.spyOn(addAccountStub, 'add')
    const request = makeFakeRequest()
    await sut.handle(request)
    expect(AddAccountSpy).toHaveBeenCalledWith({
      name: SIGNUP.name,
      email: SIGNUP.email,
      password: SIGNUP.password
    })
  })

  it('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(throwInternalServerError)
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

  it('should return 403 if the email is already taken', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(Promise.resolve(false))
    const request = makeFakeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(Forbidden(new EmailAlreadyTaken()))
  })

  it('should return 500 if authenticate throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'authenticate')
      .mockImplementationOnce(throwInternalServerError)
    const request = makeFakeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(ServerError(new InternalServerError('Error')))
  })

  it('should return 200 when all fields are provided', async () => {
    const { sut } = makeSut()
    const request = makeFakeRequest()
    const httpResponse = await sut.handle(request)
    expect(httpResponse).toEqual(Ok(AUTHENTICATION))
  })
})