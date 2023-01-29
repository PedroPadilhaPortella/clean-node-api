import { SignUpController } from './signup.controller'
import { ACCOUNT, AddAccount, AUTHENTICATION, Authentication, BadRequest, EmailAlreadyTaken, Forbidden, HttpRequest, InternalServerError, MissingParamError, mockAddAccount, mockAuthentication, mockValidation, Ok, ServerError, throwInternalServerError, Unauthorized, Validation } from './signup.protocols'

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

const makeFakeRequest = (): HttpRequest => ({
  body: { ...ACCOUNT }
})

describe('SignUp Controller', () => {
  
  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const AddAccountSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(AddAccountSpy).toHaveBeenCalledWith({
      name: ACCOUNT.name,
      email: ACCOUNT.email,
      password: ACCOUNT.password
    })
  })

  it('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(throwInternalServerError)
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ServerError(new InternalServerError('Error')))
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
    jest.spyOn(authenticationStub, 'authenticate').mockReturnValueOnce(Promise.resolve(null))
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(Unauthorized())
  })

  it('should return 403 if the email is already taken', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(Promise.resolve(null))
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(Forbidden(new EmailAlreadyTaken()))
  })

  it('should return 500 if authenticate throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'authenticate')
      .mockImplementationOnce(throwInternalServerError)
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ServerError(new InternalServerError('Error')))
  })

  it('should return 200 when all fields are provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(Ok(AUTHENTICATION))
  })
})