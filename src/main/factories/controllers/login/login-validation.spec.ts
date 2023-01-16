import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '@/presentation/helpers/validators'
import { Validation } from '@/presentation/protocols'
import { mockEmailValidator } from '@/utils'
import { createLoginValidations } from './login-validation'

jest.mock('@/presentation/helpers/validators/validation-composite')

describe('LoginValidationFactory', () => { 

  it('should call validationComposite with all validations', () => {
    const validations: Validation[] = []
    const emailValidationStub = mockEmailValidator()

    createLoginValidations()

    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', emailValidationStub))
    
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})