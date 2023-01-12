import { InvalidParamError } from "@/presentation/errors"
import { CompareFieldsValidation } from "./compare-fields-validation"

describe('CompareFieldsValidation ', () => {

  it('should return a InvalidParamError if validation fails', () => {
    const sut = new CompareFieldsValidation('field', 'field2Compare')
    const error = sut.validate({ field: 'value', field2Compare: 'data' })
    expect(error).toEqual(new InvalidParamError('field2Compare'))
  })
  
  it('should return null if validation pass', () => {
    const sut = new CompareFieldsValidation('field', 'field2Compare')
    const error = sut.validate({ field: 'value', field2Compare: 'value' })
    expect(error).toBeNull()
  })
})