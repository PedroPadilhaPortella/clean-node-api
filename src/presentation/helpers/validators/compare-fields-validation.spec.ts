import { InvalidParamError } from "../../errors"
import { CompareFieldsValidation } from "./compare-fields-validation"

describe('CompareFieldsValidation ', () => {

  it('should return a InvalidParamError if validation fails', () => {
    const sut = new CompareFieldsValidation('field1', 'field2')
    const error = sut.validate({ field1: 'nome', field2: 'nome2' })
    expect(error).toEqual(new InvalidParamError('field2'))
  })
  
  it('should return null if validation pass', () => {
    const sut = new CompareFieldsValidation('field1', 'field2')
    const error = sut.validate({ field1: 'nome', field2: 'nome' })
    expect(error).toBeNull()
  })
})