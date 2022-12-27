import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../../presentation/helpers/validators'
import { Validation, EmailValidator } from '../../../../presentation/protocols'
import { createLoginValidations } from './login-validation'

jest.mock('../../../../presentation/helpers/validators/validation-composite')

const createEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (field: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('LoginValidationFactory', () => { 

  it('should call validationComposite with all validations', () => {
    const validations: Validation[] = []
    const emailValidationStub = createEmailValidator()

    createLoginValidations()

    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', emailValidationStub))
    
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})