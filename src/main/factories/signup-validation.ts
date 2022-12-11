import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation'
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { Validation } from './../../presentation/helpers/validators/validation'

export const createSignUpValidations = (): ValidationComposite => {
  const fields = ['name', 'email', 'password', 'passwordConfirmation']
  const validations: Validation[] = []

  for (const field of fields) {
    validations.push(new RequiredFieldValidation(field))
  }

  return new ValidationComposite(validations)
}