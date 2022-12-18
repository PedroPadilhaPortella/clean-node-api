import { CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../presentation/helpers/validators'
import { Validation } from '../../../presentation/protocols/validation.interface'
import { EmailValidatorAdapter } from '../../adapters/validators/email.validator.adapter'

export const createSignUpValidations = (): ValidationComposite => {
  const fields = ['name', 'email', 'password', 'passwordConfirmation']
  const validations: Validation[] = []

  for (const field of fields) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}