import { EmailValidatorAdapter } from './email.validator.adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

describe('EmailValidatorAdapter', () => {

  it('should return false if email is not valid', () => {
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })
  
  it('should return true if email is valid', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('valid.email@mail.com')
    expect(isValid).toBe(true)
  })
})