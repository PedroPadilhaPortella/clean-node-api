import { MissingParamError } from "../../errors"
import { RequiredFieldValidation } from "./required-field-validation"

describe('RequiredFieldValidation', () => {

  it('should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldValidation('field')
    const error = sut.validate({ name: 'nome' })
    expect(error).toEqual(new MissingParamError('field'))
  })

})