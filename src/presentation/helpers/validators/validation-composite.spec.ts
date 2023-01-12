import { MissingParamError } from '@/presentation/errors/missing-param-error'
import { RequiredFieldValidation } from './required-field-validation'
import { ValidationComposite } from "./validation-composite"
import { Validation } from '@/presentation/protocols'

type SutTypes = {
  sut: ValidationComposite
  validators: Validation[]
}

const makeSut = (): SutTypes => {
  const validators = [
    new RequiredFieldValidation('field'),
    new RequiredFieldValidation('field2Compare')
  ]
  const sut = new ValidationComposite(validators)
  return { sut, validators }
}

describe('ValidationComposite ', () => {

  it('should return a Error if any validation fails', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'value' })
    expect(error).toEqual(new MissingParamError('field2Compare'))
  })

  it('should return null if all validation pass', () => {
    const { sut } = makeSut()
    const error = sut.validate({ field: 'value', field2Compare: 'valueToCompare' })
    expect(error).toBeNull()
  })

  it('should return the first Error if it validation fails', () => {
    const { sut } = makeSut()
    const error = sut.validate({ })
    expect(error).toEqual(new MissingParamError('field'))
  })
})