import { InternalServerError, MissingParamError } from '../../errors'
import { BadRequest, Ok, ServerError } from '../../helpers/http.helper'
import { LoginController } from './login'
import { EmailValidator } from './login.protocols'

const createEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (field: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = createEmailValidator()
  const sut = new LoginController(emailValidatorStub)
  return { sut, emailValidatorStub }
}

describe('Login Controller', () => {

  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = { body: { password: 'pass123' } }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(BadRequest(new MissingParamError('email')))
  })

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = { body: { email: 'pedro@gmail.com' } }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(BadRequest(new MissingParamError('password')))
  })

  it('should call email validator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = { body: { email: 'pedro@gmail.com', password: 'senha123' } }
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  it('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
      throw new InternalServerError('Erro')
    })
    const httpRequest = { body: { email: 'pedro@gmail.com', password: 'senha123' } }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(ServerError(new InternalServerError('Erro')))
  })
  
  it('should return 200 when all fields are provided', async () => {
    const { sut } = makeSut()
    const httpRequest = { body: { email: 'pedro@gmail.com', password: 'senha123' } }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(Ok({ email: 'pedro@gmail.com', password: 'senha123' }))
  })
})