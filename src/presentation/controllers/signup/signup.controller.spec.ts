import { AccountModel } from '../../../domain/models/account.model'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account.interface'
import { InternalServerError, MissingParamError } from '../../errors'
import { HttpRequest } from '../../protocols/http.interface'
import { SignUpController } from './signup.controller'
import { Authentication, AuthenticationModel, BadRequest, Ok, ServerError, Unauthorized, Validation } from './signup.protocols'

interface SutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const addAccountStub = createAddAccount()
  const validationStub = createValidation()
  const authenticationStub = createAuthenticationStub()
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)
  return { sut, addAccountStub, validationStub, authenticationStub }
}

const createAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount: AccountModel = makeFakeAccount()
      return await new Promise(resolve => resolve(fakeAccount))
    }
  }
  return new AddAccountStub()
}

const createValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

const createAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async authenticate (authentication: AuthenticationModel): Promise<string> {
      return 'login_token'
    }
  }
  return new AuthenticationStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'user',
    email: 'email@mail.com',
    password: 'pass123',
    passwordConfirmation: 'pass123'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: '1', 
  name: 'user', 
  email: 'email@mail.com', 
  password: 'pass123'
})

describe('SignUp Controller', () => {
  
  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const AddAccountSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(AddAccountSpy).toHaveBeenCalledWith({
      name: 'user',
      email: 'email@mail.com',
      password: 'pass123'
    })
  })

  it('should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementation(async () => {
      return await new Promise((resolve, reject) => reject(new InternalServerError('Erro')))
    })
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

  it('should return 200 when all fields are provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(Ok({ accessToken: 'login_token' }))
  })
})