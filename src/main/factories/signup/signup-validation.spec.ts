import { CompareFieldsValidation } from '../../../presentation/helpers/validators/compare-fields-validation'
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { RequiredFieldValidation } from "../../../presentation/helpers/validators/required-field-validation"
import { ValidationComposite } from "../../../presentation/helpers/validators/validation-composite"
import { EmailValidator } from '../../../presentation/protocols/email.validator.interface'
import { Validation } from '../../../presentation/helpers/validators/validation.interface'
import { createSignUpValidations } from "./signup-validation"

jest.mock('../../../presentation/helpers/validators/validation-composite')

const createEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (field: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignUpValidationFactory', () => { 

  it('should call validationComposite with all validations', () => {
    const validations: Validation[] = []
    const emailValidationStub = createEmailValidator()

    createSignUpValidations()

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', emailValidationStub))
    
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})