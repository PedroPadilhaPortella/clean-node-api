import { HttpRequest } from './../../protocols/http.interface'
import { AccountModel } from '../../../domain/models/account.model'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account.interface'
import { InternalServerError, InvalidParamError, MissingParamError } from '../../errors'
import { EmailValidator } from './signup.protocols'
import { SignUpController } from './signup'
import { BadRequest, Ok, ServerError } from '../../helpers/http.helper'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = createEmailValidator()
  const addAccountStub = createAddAccount()
  const sut = new SignUpController(addAccountStub, emailValidatorStub)
  return { sut, emailValidatorStub, addAccountStub }
}

const createEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (field: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
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
  it('should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'email@mail.com',
        password: 'pass123',
        passwordConfirmation: 'pass123'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(BadRequest(new MissingParamError('name')))
  })

  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'user',
        password: 'pass123',
        passwordConfirmation: 'pass123'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse)
    expect(httpResponse).toEqual(BadRequest(new MissingParamError('email')))
  })

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'user',
        email: 'email@mail.com',
        passwordConfirmation: 'pass123'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(BadRequest(new MissingParamError('password')))
  })

  it('should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'user',
        email: 'email@mail.com',
        password: 'pass123'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(BadRequest(new MissingParamError('passwordConfirmation')))
  })

  it('should return 400 if passwordConfirmation is diferent from the password', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'user',
        email: 'email@mail.com',
        password: 'pass123',
        passwordConfirmation: 'client123'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(BadRequest(new InvalidParamError('passwordConfirmation')))
  })

  it('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(BadRequest(new InvalidParamError('email')))
  })

  it('should call email validator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(makeFakeRequest().body.email)
  })

  it('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
      throw new InternalServerError('Erro')
    })
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ServerError(new Error('Erro')))
  })

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
    expect(httpResponse).toEqual(ServerError(new Error('Erro')))
  })

  it('should return 200 when all fields are provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeRequest()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(Ok(makeFakeAccount()))
  })
})