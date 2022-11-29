import { EmailValidator } from './../protocols/email.validator'
import { InvalidParamError } from '../errors/invalid-param-error copy'
import { MissingParamError } from '../errors/missing-param-error'
import { SignUpController } from './signup'

interface SutTypes {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const createSignUpController = (): SutTypes => {
  class EmailValidatorStub implements EmailValidator {
    isValid (field: string): boolean {
      return true
    }
  }

  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)
  return { sut, emailValidatorStub }
}

describe('SignUp Controller', () => {

  it('should return 200 when all fields are provided', () => {
    const { sut } = createSignUpController()
    const httpRequest = {
      body: {
        name: 'user',
        email: 'email@mail.com',
        password: 'user123',
        passwordConfirmation: 'user123'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({})
  })

  it('should return 400 if no name is provided', () => {
    const { sut } = createSignUpController()
    const httpRequest = {
      body: {
        email: 'email@mail.com',
        password: 'user123',
        passwordConfirmation: 'user123'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  it('should return 400 if no email is provided', () => {
    const { sut } = createSignUpController()
    const httpRequest = {
      body: {
        name: 'user',
        password: 'user123',
        passwordConfirmation: 'user123'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('should return 400 if no password is provided', () => {
    const { sut } = createSignUpController()
    const httpRequest = {
      body: {
        name: 'user',
        email: 'email@mail.com',
        passwordConfirmation: 'user123'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('should return 400 if no passwordConfirmation is provided', () => {
    const { sut } = createSignUpController()
    const httpRequest = {
      body: {
        name: 'user',
        email: 'email@mail.com',
        password: 'user123'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  it('should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = createSignUpController()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'user',
        email: 'invalid_email@mail.com',
        password: 'user123',
        passwordConfirmation: 'user123'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('should call email validator with correct email', () => {
    const { sut, emailValidatorStub } = createSignUpController()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        name: 'user',
        email: 'any_email@mail.com',
        password: 'user123',
        passwordConfirmation: 'user123'
      }
    }
    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})