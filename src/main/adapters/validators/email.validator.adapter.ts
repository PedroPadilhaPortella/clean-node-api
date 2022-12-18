import validator from 'validator'
import { EmailValidator } from '../../../presentation/protocols/email.validator.interface'

export class EmailValidatorAdapter implements EmailValidator {
  
  isValid (email: string): boolean {
    return validator.isEmail(email)
  }
}