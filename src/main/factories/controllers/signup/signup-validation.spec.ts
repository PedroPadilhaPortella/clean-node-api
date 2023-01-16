import { CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/presentation/helpers/validators'
import { Validation } from '@/presentation/protocols'
import { mockEmailValidator } from '@/utils'
import { createSignUpValidations } from "./signup-validation"

jest.mock('@/presentation/helpers/validators/validation-composite')

describe('SignUpValidationFactory', () => { 

  it('should call validationComposite with all validations', () => {
    const validations: Validation[] = []
    const emailValidationStub = mockEmailValidator()

    createSignUpValidations()

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', emailValidationStub))
    
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})