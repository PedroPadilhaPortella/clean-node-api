import { InternalServerError, MissingParamError } from '../errors'
import { Ok, BadRequest, ServerError } from './http.helper'
describe('HttpHelper', () => {

  it('Ok should statusCode200 and a body', () => {
    expect(Ok({}))
      .toEqual({ statusCode: 200, body: {} })
  })

  it('BadRequest should statusCode200 and a body', () => {
    expect(BadRequest(new MissingParamError('name')))
      .toEqual({ statusCode: 400, body: new MissingParamError('name') })
  })

  it('BadRequest should statusCode200 and a body', () => {
    expect(ServerError())
      .toEqual({ statusCode: 500, body: new InternalServerError() })
  })
})