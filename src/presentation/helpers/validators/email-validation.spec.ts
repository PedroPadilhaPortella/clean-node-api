import { InternalServerError, InvalidParamError } from '../../errors'
import { EmailValidator } from '../../protocols'
import { EmailValidation } from './email-validation'

const createEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (field: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = createEmailValidator()
  const sut = new EmailValidation('email', emailValidatorStub)
  return { sut, emailValidatorStub }
}

describe('EmailValidation', () => {
  
  it('should return an error if an emailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate({ email: 'mail@gmail.com' })
    expect(error).toEqual(new InvalidParamError('email'))
  })

  it('should call email validator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.validate({ email: 'mail@gmail.com' })
    expect(isValidSpy).toHaveBeenCalledWith('mail@gmail.com')
  })
  
  it('should throw if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
      throw new InternalServerError('Erro')
    })
    expect(sut.validate).toThrow()
  })
})