import { EmailValidatorAdapter } from './email.validator.adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const createEmailValidator = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidatorAdapter', () => {

  it('should return false if email is not valid', () => {
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const sut = createEmailValidator()
    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })
  
  it('should return true if email is valid', () => {
    const sut = createEmailValidator()
    const isValid = sut.isValid('valid.email@mail.com')
    expect(isValid).toBe(true)
  })
  
  it('should call validator with a valid email', () => {
    const isEmailSpy = jest.spyOn(validator, 'isEmail')
    const sut = createEmailValidator()
    const email = 'valid.email@mail.com'
    sut.isValid(email)
    expect(isEmailSpy).toHaveBeenCalledWith(email)
  })
})